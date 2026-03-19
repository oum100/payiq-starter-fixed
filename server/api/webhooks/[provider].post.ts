import { readRawBody, getHeader, setResponseStatus } from "h3";
import { verifyWebhookSignature } from "~/server/utils/webhook/verify";
import { checkIpAllowlist } from "~/server/utils/webhook/ip-allowlist";
import { rateLimitWebhook } from "~/server/utils/webhook/rate-limit";
import { isDuplicateEvent, markEventProcessed } from "~/server/utils/webhook/dedupe";
import { logWebhook } from "~/server/utils/webhook/logger";
import { enqueueWebhookJob } from "~/server/utils/webhook/queue";
import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const provider = event.context.params?.provider;

  const rawBody = (await readRawBody(event)) || "";
  const ip = event.node.req.socket.remoteAddress || "";

  const signature = getHeader(event, "x-payiq-signature") || "";
  const timestamp = getHeader(event, "x-payiq-timestamp") || "";
  const eventId = getHeader(event, "x-payiq-event-id") || "";
  const merchantId = getHeader(event, "x-merchant-id") || "";

  // 1) IP allowlist
  checkIpAllowlist(ip);

  // 2) Rate limit
  await rateLimitWebhook(`webhook:${provider}:${ip}`);

  // 3) log RECEIVED
  const webhookEvent = await prisma.webhookEvent.create({
    data: {
      provider,
      eventId,
      merchantId,
      payload: rawBody,
      headers: {
        signature,
        timestamp,
      },
      status: "RECEIVED",
    },
  });

  try {
    // 4) Verify signature
    await verifyWebhookSignature({
      rawBody,
      signature,
      timestamp,
      merchantId,
    });

    // 5) Replay protection done in verify()

    // 6) Duplicate check
    if (await isDuplicateEvent(eventId)) {
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: { status: "DUPLICATE" },
      });

      return { ok: true };
    }

    // 7) mark VERIFIED
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { status: "VERIFIED" },
    });

    // 8) enqueue async processing
    await enqueueWebhookJob({
      eventId,
      provider,
      rawBody,
      merchantId,
    });

    // 9) fast ACK
    return { ok: true };
  } catch (err: any) {
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { status: "FAILED", error: err.message },
    });

    setResponseStatus(event, 400);
    return { error: "invalid webhook" };
  }
});