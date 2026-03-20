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

  // IPv4 mapped IPv6 เช่น ::ffff:127.0.0.1
  if (ip.startsWith("::ffff:")) {
    return ip.slice(7);
  }

  return ip;
}

function assertIpAllowed(event: Parameters<typeof defineEventHandler>[0] extends never ? never : any) {
  const allowedIps = getAllowedIps();

  // ถ้าไม่ได้ตั้ง allowlist ให้ข้ามสำหรับ dev/test
  if (!allowedIps.length) return;

  const requestIp = normalizeIp(getRequestIP(event, { xForwardedFor: true }));

  if (!requestIp || !allowedIps.includes(requestIp)) {
    throw new Error("ip not allowed");
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

    await prisma.webhookEvent.update({
      where: { id: created.id },
      data: {
        status: "FAILED",
        lastError: message,
      },
    });

    setResponseStatus(event, message === "ip not allowed" ? 403 : 400);
    return { error: message };
  }
});