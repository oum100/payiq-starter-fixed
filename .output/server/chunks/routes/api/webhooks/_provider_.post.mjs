import { d as defineEventHandler, s as setResponseStatus, q as readRawBody, o as getHeader, p as prisma, v as getRequestIP, j as redis } from '../../../nitro/nitro.mjs';
import nodeCrypto from 'node:crypto';
import { w as webhookInboundQueue } from '../../../_/bullmq.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@prisma/client';
import 'ioredis';
import 'bullmq';

const TOLERANCE = Number(process.env.WEBHOOK_TIMESTAMP_TOLERANCE_SEC || 300);
function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return nodeCrypto.timingSafeEqual(bufA, bufB);
}
async function verifyWebhookSignature({
  rawBody,
  signature,
  timestamp,
  merchantId
}) {
  if (!signature || !timestamp) {
    throw new Error("missing signature");
  }
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) {
    throw new Error("invalid timestamp");
  }
  const now = Math.floor(Date.now() / 1e3);
  if (Math.abs(now - ts) > TOLERANCE) {
    throw new Error("timestamp out of tolerance");
  }
  const secrets = getSecrets();
  if (!secrets.length) {
    throw new Error("webhook secret is not configured");
  }
  const payload = `${timestamp}.${rawBody}`;
  const matched = secrets.some((secret) => {
    const expected = nodeCrypto.createHmac("sha256", secret).update(payload).digest("hex");
    return timingSafeEqual(expected, signature);
  });
  if (!matched) {
    throw new Error("invalid signature");
  }
}
function getSecrets(_merchantId) {
  return (process.env.WEBHOOK_SECRET || "").split(",").map((s) => s.trim()).filter(Boolean);
}

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return "unknown error";
}
function getAllowedIps() {
  return (process.env.WEBHOOK_IP_ALLOWLIST || "").split(",").map((s) => s.trim()).filter(Boolean);
}
function normalizeIp(ip) {
  if (!ip) return null;
  if (ip.startsWith("::ffff:")) {
    return ip.slice(7);
  }
  return ip;
}
function assertIpAllowed(event) {
  const allowedIps = getAllowedIps();
  if (!allowedIps.length) return;
  const requestIp = normalizeIp(getRequestIP(event, { xForwardedFor: true }));
  if (!requestIp || !allowedIps.includes(requestIp)) {
    throw new Error("ip not allowed");
  }
}
function getWebhookRateLimit() {
  const raw = Number(process.env.WEBHOOK_RATE_LIMIT || 100);
  if (!Number.isFinite(raw) || raw <= 0) return 100;
  return Math.floor(raw);
}
async function assertWebhookRateLimit(event, provider) {
  const limit = getWebhookRateLimit();
  const requestIp = normalizeIp(getRequestIP(event, { xForwardedFor: true })) || "unknown";
  const now = Date.now();
  const windowMs = 6e4;
  const windowKey = Math.floor(now / windowMs);
  const key = `ratelimit:webhook:${provider}:${requestIp}:${windowKey}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.pexpire(key, windowMs);
  }
  if (count > limit) {
    const ttlMs = await redis.pttl(key);
    const retryAfterSec = ttlMs > 0 ? Math.max(1, Math.ceil(ttlMs / 1e3)) : 60;
    const error = new Error("rate limit exceeded");
    error.retryAfterSec = retryAfterSec;
    throw error;
  }
}
const _provider__post = defineEventHandler(async (event) => {
  var _a;
  const provider = (_a = event.context.params) == null ? void 0 : _a.provider;
  if (!provider) {
    setResponseStatus(event, 400);
    return { error: "missing provider" };
  }
  const rawBody = await readRawBody(event, "utf8") || "";
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
        eventId
      }
    },
    select: {
      id: true,
      status: true
    }
  });
  if (existing) {
    await prisma.webhookEvent.update({
      where: { id: existing.id },
      data: { status: "DUPLICATE" }
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
        merchantId
      }
    },
    select: {
      id: true
    }
  });
  try {
    assertIpAllowed(event);
    await assertWebhookRateLimit(event, provider);
    await verifyWebhookSignature({
      rawBody,
      signature,
      timestamp,
      merchantId: merchantId || void 0
    });
    await prisma.webhookEvent.update({
      where: { id: created.id },
      data: {
        status: "VERIFIED",
        verifiedAt: /* @__PURE__ */ new Date()
      }
    });
    await webhookInboundQueue.add(
      "provider.webhook.process",
      {
        webhookEventId: created.id
      },
      {
        jobId: `webhook__${created.id}`,
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 2e3
        },
        removeOnComplete: 1e3,
        removeOnFail: 1e3
      }
    );
    setResponseStatus(event, 200);
    return { ok: true };
  } catch (error) {
    const message = getErrorMessage(error);
    const retryAfterSec = error == null ? void 0 : error.retryAfterSec;
    await prisma.webhookEvent.update({
      where: { id: created.id },
      data: {
        status: "FAILED",
        lastError: message
      }
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

export { _provider__post as default };
//# sourceMappingURL=_provider_.post.mjs.map
