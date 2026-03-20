import {
  defineEventHandler,
  getHeader,
  getRequestIP,
  readRawBody,
  setResponseStatus,
} from "h3";
import { prisma } from "~/server/lib/prisma";
import { verifyWebhookSignature } from "~/server/utils/webhook/verify";
import { webhookInboundQueue } from "~/server/lib/bullmq";
import { redis } from "~/server/lib/redis";

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

  if (ip.startsWith("::ffff:")) {
    return ip.slice(7);
  }

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
    const retryAfterSec =
      ttlMs > 0 ? Math.max(1, Math.ceil(ttlMs / 1000)) : 60;

    const error = new Error("rate limit exceeded");
    (error as any).retryAfterSec = retryAfterSec;
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  const provider = event.context.params?.provider;

  if (!provider) {
    setResponseStatus(event, 400);
    return { error: "missing provider" };
  }

  const rawBody = (await readRawBody(event, "utf8")) || "";
  const signature = getHeader(event, "x-payiq-signature") || "";
  const timestamp = getHeader(event, "x-payiq-timestamp") || "";
  const eventId = getHeader(event, "x-payiq-event-id") || "";
  const merchantId = getHeader(event, "x-merchant-id") || null;

  if (!eventId) {
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
    await prisma.webhookEvent.update({
      where: { id: existing.id },
      data: { status: "DUPLICATE" },
    });

    setResponseStatus(event, 200);
    return { ok: true, duplicate: true };
  }

  const created = await prisma.webhookEvent.create({
    data: {
      provider,
      eventId,
      merchantId,
      payload: rawBody,
      status: "RECEIVED",
      headersJson: {
        signature,
        timestamp,
        merchantId,
      },
    },
    select: {
      id: true,
    },
  });

  try {
    assertIpAllowed(event);
    await assertWebhookRateLimit(event, provider);

    await verifyWebhookSignature({
      rawBody,
      signature,
      timestamp,
      merchantId: merchantId || undefined,
    });

    await prisma.webhookEvent.update({
      where: { id: created.id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    });

    await webhookInboundQueue.add(
      "provider.webhook.process",
      {
        webhookEventId: created.id,
      },
      {
        jobId: `webhook__${created.id}`,
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: 1000,
        removeOnFail: 1000,
      },
    );

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

    if (retryAfterSec) {
      event.node.res.setHeader("Retry-After", String(retryAfterSec));
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