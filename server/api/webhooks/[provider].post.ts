import {
  defineEventHandler,
  getHeader,
  getRequestIP,
  readRawBody,
  setResponseStatus,
} from "h3";
import { prisma } from "~/server/lib/prisma";
import { redis } from "~/server/lib/redis";
import {
  getEventRequestContext,
  setEventRequestContext,
} from "~/server/lib/request-context";
import { logEvent } from "~/server/lib/observability";
import { webhookInboundQueue } from "~/server/tasks/queues";
import { QUEUE_POLICIES } from "~/server/tasks/queue-policy";
import { verifyWebhookSignature } from "~/server/utils/webhook/verify";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "unknown error";
}

function getAllowedIps(): string[] {
  return (process.env.WEBHOOK_IP_ALLOWLIST || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  if (ip.startsWith("::ffff:")) return ip.slice(7);
  return ip;
}

function assertIpAllowed(event: any) {
  const allowedIps = getAllowedIps();
  if (!allowedIps.length) return;

  const requestIp = normalizeIp(getRequestIP(event, { xForwardedFor: true }));

  if (!requestIp || !allowedIps.includes(requestIp)) {
    throw new Error("ip not allowed");
  }
}

function getWebhookRateLimit(): number {
  const raw = Number(process.env.WEBHOOK_RATE_LIMIT || 100);
  if (!Number.isFinite(raw) || raw <= 0) return 100;
  return Math.floor(raw);
}

async function assertWebhookRateLimit(event: any, provider: string) {
  const limit = getWebhookRateLimit();

  const requestIp =
    normalizeIp(getRequestIP(event, { xForwardedFor: true })) || "unknown";

  const now = Date.now();
  const windowMs = 60_000;
  const windowKey = Math.floor(now / windowMs);
  const key = `ratelimit:webhook:${provider}:${requestIp}:${windowKey}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.pexpire(key, windowMs);
  }

  if (count > limit) {
    const ttlMs = await redis.pttl(key);
    const retryAfterSec = ttlMs > 0 ? Math.max(1, Math.ceil(ttlMs / 1000)) : 60;

    const error = new Error("rate limit exceeded") as Error & {
      retryAfterSec?: number;
    };
    error.retryAfterSec = retryAfterSec;
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  const provider = event.context.params?.provider;

  if (!provider) {
    logEvent({
      level: "warn",
      event: "webhook.inbound.invalid_request",
      data: { reason: "missing_provider" },
    });

    setResponseStatus(event, 400);
    return { error: "missing provider" };
  }

  setEventRequestContext(event, { provider });

  const rawBody = (await readRawBody(event, "utf8")) || "";
  const signature = getHeader(event, "x-payiq-signature") || "";
  const timestamp = getHeader(event, "x-payiq-timestamp") || "";
  const eventId = getHeader(event, "x-payiq-event-id") || "";

  // 🔥 FIX: normalize merchantId
  const headerMerchantId = getHeader(event, "x-merchant-id");
  const merchantId = headerMerchantId ?? null;

  const requestIp = normalizeIp(getRequestIP(event, { xForwardedFor: true }));

  logEvent({
    event: "webhook.inbound.received",
    data: {
      provider,
      eventId,
      merchantId,
      requestIp,
      hasSignature: Boolean(signature),
      hasTimestamp: Boolean(timestamp),
      payloadSize: Buffer.byteLength(rawBody, "utf8"),
    },
  });

  if (!eventId) {
    logEvent({
      level: "warn",
      event: "webhook.inbound.invalid_request",
      data: {
        provider,
        merchantId,
        requestIp,
        reason: "missing_event_id",
      },
    });

    setResponseStatus(event, 400);
    return { error: "missing event id" };
  }

  const existing = await prisma.webhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider,
        eventId,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (existing) {
    setEventRequestContext(event, {
      webhookEventId: existing.id,
    });

    await prisma.webhookEvent.update({
      where: { id: existing.id },
      data: { status: "DUPLICATE" },
    });

    logEvent({
      level: "warn",
      event: "webhook.inbound.duplicate",
      data: {
        provider,
        eventId,
        webhookEventId: existing.id,
        previousStatus: existing.status,
      },
    });

    setResponseStatus(event, 200);
    return { ok: true, duplicate: true };
  }

  const created = await prisma.webhookEvent.create({
    data: {
      provider,
      eventId,
      merchantId: merchantId ?? null,
      payload: rawBody,
      status: "RECEIVED",
      headersJson: {
        signature,
        timestamp,
        ...(merchantId !== null && { merchantId }),
      },
    },
    select: { id: true },
  });

  setEventRequestContext(event, {
    webhookEventId: created.id,
  });

  logEvent({
    event: "webhook.inbound.persisted",
    data: {
      provider,
      eventId,
      merchantId,
      webhookEventId: created.id,
      status: "RECEIVED",
    },
  });

  try {
    assertIpAllowed(event);
    await assertWebhookRateLimit(event, provider);

    await verifyWebhookSignature({
      rawBody,
      signature,
      timestamp,
      ...(merchantId !== null && { merchantId }),
    });

    await prisma.webhookEvent.update({
      where: { id: created.id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    });

    logEvent({
      event: "webhook.inbound.verified",
      data: {
        provider,
        webhookEventId: created.id,
      },
    });

    const context = getEventRequestContext(event);

    await webhookInboundQueue.add(
      QUEUE_POLICIES.webhookInbound.jobName,
      {
        webhookEventId: created.id,
        meta: {
          ...(context.requestId !== undefined && {
            requestId: context.requestId,
          }),
          ...(context.traceId !== undefined && {
            traceId: context.traceId,
          }),
          ...(context.provider !== undefined && {
            provider: context.provider,
          }),
          ...(context.tenantId !== undefined && {
            tenantId: context.tenantId,
          }),
          ...(context.apiKeyPrefix !== undefined && {
            apiKeyPrefix: context.apiKeyPrefix,
          }),
          ...(context.method !== undefined && {
            method: context.method,
          }),
          ...(context.path !== undefined && {
            path: context.path,
          }),
          ...(context.route !== undefined && {
            route: context.route,
          }),
        },
      },
      {
        jobId: `webhook__${created.id}`,
        attempts: QUEUE_POLICIES.webhookInbound.attempts,
        backoff: {
          type: "exponential",
          delay: QUEUE_POLICIES.webhookInbound.backoffDelayMs,
        },
        removeOnComplete: QUEUE_POLICIES.webhookInbound.removeOnComplete,
        removeOnFail: QUEUE_POLICIES.webhookInbound.removeOnFail,
      },
    );

    logEvent({
      event: "webhook.inbound.enqueued",
      data: {
        provider,
        webhookEventId: created.id,
        queue: QUEUE_POLICIES.webhookInbound.queueName,
        jobName: QUEUE_POLICIES.webhookInbound.jobName,
        jobId: `webhook__${created.id}`,
      },
    });

    setResponseStatus(event, 200);
    return { ok: true };
  } catch (error) {
    const message = getErrorMessage(error);
    const retryAfterSec = (error as any)?.retryAfterSec;

    await prisma.webhookEvent.update({
      where: { id: created.id },
      data: {
        status: "FAILED",
        lastError: message,
      },
    });

    logEvent({
      level: "error",
      event: "webhook.inbound.failed",
      data: {
        provider,
        eventId,
        merchantId,
        webhookEventId: created.id,
        retryAfterSec,
      },
      error,
    });

    if (typeof retryAfterSec === "number") {
      event.node.res.setHeader("Retry-After", retryAfterSec);
    }

    if (message === "ip not allowed") {
      setResponseStatus(event, 403);
    } else if (message === "rate limit exceeded") {
      setResponseStatus(event, 429);
    } else {
      setResponseStatus(event, 400);
    }

    return { error: message };
  }
});
