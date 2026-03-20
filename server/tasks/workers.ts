import { Job, Queue, QueueEvents, Worker } from "bullmq";
import { redis } from "~/server/lib/redis";
import { queueNames } from "~/server/lib/bullmq";
import { processProviderCallback } from "~/server/services/callbacks/processProviderCallback";
import { deliverWebhook } from "~/server/services/webhooks/deliverWebhook";
import { reconcilePayment } from "~/server/services/reconcile/reconcilePayment";
import { handleWebhookInboundJob } from "~/server/services/webhooks/handleWebhookInboundJob";
import { logger } from "~/server/lib/logger";
import { NonRetryableJobError } from "~/server/tasks/job-errors";
import { runWithRequestContext } from "~/server/lib/request-context";

type QueuePolicy = {
  queueName: string;
  jobName: string;
  attempts: number;
  backoffDelayMs: number;
  concurrency: number;
};

const QUEUE_POLICIES = {
  providerCallback: {
    queueName: queueNames.callback,
    jobName: "provider.callback.process",
    attempts: 5,
    backoffDelayMs: 2000,
    concurrency: 20,
  },
  merchantWebhook: {
    queueName: queueNames.webhook,
    jobName: "merchant.webhook.deliver",
    attempts: 8,
    backoffDelayMs: 3000,
    concurrency: 50,
  },
  webhookInbound: {
    queueName: queueNames.webhookInbound,
    jobName: "provider.webhook.process",
    attempts: 5,
    backoffDelayMs: 2000,
    concurrency: 20,
  },
  reconcile: {
    queueName: queueNames.reconcile,
    jobName: "payment.reconcile.single",
    attempts: 3,
    backoffDelayMs: 5000,
    concurrency: 10,
  },
} as const satisfies Record<string, QueuePolicy>;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof NonRetryableJobError && error.code
        ? { code: error.code }
        : {}),
    };
  }

  return {
    message: String(error),
  };
}

function logJobEvent(input: {
  level?: "info" | "warn" | "error";
  event: string;
  queue: string;
  job?: Job;
  data?: Record<string, unknown>;
  error?: unknown;
}) {
  const payload = {
    event: input.event,
    queue: input.queue,
    jobId: input.job?.id,
    jobName: input.job?.name,
    attemptsMade: input.job?.attemptsMade,
    data: input.data,
    error: input.error ? serializeError(input.error) : undefined,
  };

  const level = input.level ?? "info";

  if (level === "error") {
    logger.error(payload, input.event);
    return;
  }

  if (level === "warn") {
    logger.warn(payload, input.event);
    return;
  }

  logger.info(payload, input.event);
}

const callbackDlq = new Queue(`${queueNames.callback}-dlq`, {
  connection: redis,
});

const webhookDlq = new Queue(`${queueNames.webhook}-dlq`, {
  connection: redis,
});

const webhookInboundDlq = new Queue(`${queueNames.webhookInbound}-dlq`, {
  connection: redis,
});

const reconcileDlq = new Queue(`${queueNames.reconcile}-dlq`, {
  connection: redis,
});

async function moveToDlq(params: {
  dlq: Queue;
  sourceQueue: string;
  job: Job;
  error: unknown;
}) {
  const { dlq, sourceQueue, job, error } = params;

  await dlq.add(
    `${job.name}.dlq`,
    {
      originalQueue: sourceQueue,
      originalJobId: job.id,
      originalJobName: job.name,
      failedAt: new Date().toISOString(),
      attemptsMade: job.attemptsMade + 1,
      payload: job.data,
      error: serializeError(error),
    },
    {
      jobId: `${sourceQueue}__dlq__${job.id}`,
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  );

  logJobEvent({
    level: "warn",
    event: "job.moved_to_dlq",
    queue: sourceQueue,
    job,
    data: {
      dlqName: dlq.name,
      nonRetryable: error instanceof NonRetryableJobError,
    },
  });
}

function registerQueueEvents(queueName: string) {
  const events = new QueueEvents(queueName, { connection: redis });

  events.on("completed", ({ jobId }) => {
    logger.info(
      {
        event: "queue.completed_event",
        queue: queueName,
        jobId,
      },
      "queue.completed_event",
    );
  });

  events.on("failed", ({ jobId, failedReason }) => {
    logger.warn(
      {
        event: "queue.failed_event",
        queue: queueName,
        jobId,
        failedReason,
      },
      "queue.failed_event",
    );
  });

  return events;
}

function buildWorker(params: {
  queueName: string;
  jobName: string;
  concurrency: number;
  dlq: Queue;
  processor: (job: Job) => Promise<void>;
}) {
  const { queueName, jobName, concurrency, dlq, processor } = params;

  registerQueueEvents(queueName);

  const worker = new Worker(
    queueName,
    async (job) => {
      if (job.name !== jobName) {
        logJobEvent({
          level: "warn",
          event: "job.ignored_unexpected_name",
          queue: queueName,
          job,
          data: {
            expectedJobName: jobName,
          },
        });
        return;
      }

      logJobEvent({
        event: "job.started",
        queue: queueName,
        job,
        data: {
          webhookEventId: job.data?.webhookEventId,
          paymentIntentId: job.data?.paymentIntentId,
          traceId: job.data?.meta?.traceId,
          requestId: job.data?.meta?.requestId,
          provider: job.data?.meta?.provider,
          tenantId: job.data?.meta?.tenantId,
        },
      });

      try {
        await runWithRequestContext(
          {
            traceId: job.data?.meta?.traceId,
            requestId: job.data?.meta?.requestId,
            provider: job.data?.meta?.provider,
            tenantId: job.data?.meta?.tenantId,
            apiKeyPrefix: job.data?.meta?.apiKeyPrefix,
            webhookEventId: job.data?.webhookEventId,
            paymentIntentId: job.data?.paymentIntentId,
            queue: queueName,
            jobId: String(job.id),
            jobName: job.name,
          },
          async () => {
            await processor(job);
          },
        );

        logJobEvent({
          event: "job.completed",
          queue: queueName,
          job,
        });
      } catch (error) {
        logJobEvent({
          level: "error",
          event: "job.failed",
          queue: queueName,
          job,
          error,
        });

        const isNonRetryable = error instanceof NonRetryableJobError;

        if (isNonRetryable) {
          await moveToDlq({
            dlq,
            sourceQueue: queueName,
            job,
            error,
          });

          logJobEvent({
            level: "warn",
            event: "job.non_retryable",
            queue: queueName,
            job,
            error,
          });

          return;
        }

        const attemptsAllowed = job.opts.attempts ?? 1;
        const isFinalFailure = job.attemptsMade + 1 >= attemptsAllowed;

        if (isFinalFailure) {
          await moveToDlq({
            dlq,
            sourceQueue: queueName,
            job,
            error,
          });
        }

        throw error;
      }
    },
    { connection: redis, concurrency },
  );

  worker.on("error", (error) => {
    logger.error(
      {
        event: "worker.error",
        queue: queueName,
        error: serializeError(error),
      },
      "worker.error",
    );
  });

  return worker;
}

buildWorker({
  queueName: QUEUE_POLICIES.providerCallback.queueName,
  jobName: QUEUE_POLICIES.providerCallback.jobName,
  concurrency: QUEUE_POLICIES.providerCallback.concurrency,
  dlq: callbackDlq,
  processor: async (job) => {
    await processProviderCallback(job.data.providerCallbackId);
  },
});

buildWorker({
  queueName: QUEUE_POLICIES.merchantWebhook.queueName,
  jobName: QUEUE_POLICIES.merchantWebhook.jobName,
  concurrency: QUEUE_POLICIES.merchantWebhook.concurrency,
  dlq: webhookDlq,
  processor: async (job) => {
    await deliverWebhook(job.data.webhookDeliveryId);
  },
});

buildWorker({
  queueName: QUEUE_POLICIES.webhookInbound.queueName,
  jobName: QUEUE_POLICIES.webhookInbound.jobName,
  concurrency: QUEUE_POLICIES.webhookInbound.concurrency,
  dlq: webhookInboundDlq,
  processor: async (job) => {
    await handleWebhookInboundJob(job, webhookInboundDlq);
  },
});

buildWorker({
  queueName: QUEUE_POLICIES.reconcile.queueName,
  jobName: QUEUE_POLICIES.reconcile.jobName,
  concurrency: QUEUE_POLICIES.reconcile.concurrency,
  dlq: reconcileDlq,
  processor: async (job) => {
    await reconcilePayment(job.data.paymentIntentId);
  },
});

logger.info(
  {
    event: "workers.started",
    queues: {
      providerCallback: QUEUE_POLICIES.providerCallback.queueName,
      merchantWebhook: QUEUE_POLICIES.merchantWebhook.queueName,
      webhookInbound: QUEUE_POLICIES.webhookInbound.queueName,
      reconcile: QUEUE_POLICIES.reconcile.queueName,
    },
  },
  "Workers started",
);
