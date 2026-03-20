import { createError, defineEventHandler, readBody } from "h3";
import { prisma } from "~/server/lib/prisma";
import { getEventRequestContext } from "~/server/lib/request-context";
import {
  providerCallbackQueue,
  reconcileQueue,
  webhookDeliveryQueue,
  webhookInboundQueue,
} from "~/server/tasks/queues";
import { QUEUE_POLICIES } from "~/server/tasks/queue-policy";

type SupportedQueue =
  | "webhookInbound"
  | "webhookDelivery"
  | "providerCallback"
  | "reconcile";

type RetryDlqJob = {
  originalJobId: string;
  payload: Record<string, any>;
};

type RetryDlqBody = {
  queue: SupportedQueue;
  jobs?: RetryDlqJob[];
};

type RedriveContext = ReturnType<typeof getEventRequestContext>;

function getTargetQueue(queue: SupportedQueue) {
  switch (queue) {
    case "webhookInbound":
      return {
        queue: webhookInboundQueue,
        policy: QUEUE_POLICIES.webhookInbound,
      };
    case "webhookDelivery":
      return {
        queue: webhookDeliveryQueue,
        policy: QUEUE_POLICIES.webhookDelivery,
      };
    case "providerCallback":
      return {
        queue: providerCallbackQueue,
        policy: QUEUE_POLICIES.providerCallback,
      };
    case "reconcile":
      return {
        queue: reconcileQueue,
        policy: QUEUE_POLICIES.reconcile,
      };
    default:
      throw createError({
        statusCode: 400,
        statusMessage: "Unsupported queue",
      });
  }
}

async function resolveProviderForPayload(
  queue: SupportedQueue,
  payload: Record<string, any>,
) {
  const existingMeta =
    payload?.meta && typeof payload.meta === "object" ? payload.meta : {};

  if (existingMeta.provider) {
    return existingMeta.provider as string;
  }

  if (queue === "webhookInbound" && payload?.webhookEventId) {
    const record = await prisma.webhookEvent.findUnique({
      where: { id: payload.webhookEventId },
      select: { provider: true },
    });

    return record?.provider;
  }

  return undefined;
}

async function buildRedrivePayload(
  requestContext: RedriveContext,
  payload: Record<string, any>,
  queue: SupportedQueue,
) {
  const existingMeta =
    payload && typeof payload === "object" && payload.meta && typeof payload.meta === "object"
      ? payload.meta
      : {};

  const resolvedProvider = await resolveProviderForPayload(queue, payload);

  return {
    ...payload,
    meta: {
      ...existingMeta,
      requestId: requestContext.requestId,
      traceId: requestContext.traceId,
      method: requestContext.method,
      path: requestContext.path,
      route: requestContext.route,
      provider:
        existingMeta.provider ??
        resolvedProvider ??
        requestContext.provider,
      tenantId: existingMeta.tenantId ?? requestContext.tenantId,
      apiKeyPrefix: existingMeta.apiKeyPrefix ?? requestContext.apiKeyPrefix,
      redriven: true,
      redrivenFromDlq: true,
      redriveQueue: queue,
    },
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RetryDlqBody>(event);

  if (!body?.queue || !Array.isArray(body.jobs) || body.jobs.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "queue and jobs[] are required",
    });
  }

  const requestContext = getEventRequestContext(event);
  const target = getTargetQueue(body.queue);

  const results = await Promise.all(
    body.jobs.map(async (job) => {
      if (!job?.originalJobId) {
        throw createError({
          statusCode: 400,
          statusMessage: "each job must include originalJobId",
        });
      }

      const payload = await buildRedrivePayload(
        requestContext,
        job.payload ?? {},
        body.queue,
      );

      const newJobId = `${body.queue}__redrive__${job.originalJobId}__${Date.now()}`;

      await target.queue.add(
        target.policy.jobName,
        payload,
        {
          jobId: newJobId,
          attempts: target.policy.attempts,
          backoff: {
            type: "exponential",
            delay: target.policy.backoffDelayMs,
          },
          removeOnComplete: target.policy.removeOnComplete,
          removeOnFail: target.policy.removeOnFail,
        },
      );

      return {
        originalJobId: job.originalJobId,
        newJobId,
      };
    }),
  );

  return {
    ok: true,
    queue: body.queue,
    retried: results.length,
    items: results,
  };
});