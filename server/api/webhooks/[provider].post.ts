import { defineEventHandler, getHeader, readRawBody, setResponseStatus } from "h3"
import { prisma } from "~/server/lib/prisma"
import { verifyWebhookSignature } from "~/server/utils/webhook/verify"
import { webhookInboundQueue } from "~/server/lib/bullmq"

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "unknown error"
}

export default defineEventHandler(async (event) => {
  const provider = event.context.params?.provider

  if (!provider) {
    setResponseStatus(event, 400)
    return { error: "missing provider" }
  }

  const rawBody = (await readRawBody(event, "utf8")) || ""
  const signature = getHeader(event, "x-payiq-signature") || ""
  const timestamp = getHeader(event, "x-payiq-timestamp") || ""
  const eventId = getHeader(event, "x-payiq-event-id") || ""
  const merchantId = getHeader(event, "x-merchant-id") || null

  if (!eventId) {
    setResponseStatus(event, 400)
    return { error: "missing event id" }
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
  })

  if (existing) {
    await prisma.webhookEvent.update({
      where: { id: existing.id },
      data: { status: "DUPLICATE" },
    })

    setResponseStatus(event, 200)
    return { ok: true, duplicate: true }
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
  })

  try {
    await verifyWebhookSignature({
      rawBody,
      signature,
      timestamp,
      merchantId: merchantId || undefined,
    })

    await prisma.webhookEvent.update({
      where: { id: created.id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    })

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
    )

    setResponseStatus(event, 200)
    return { ok: true }
  } catch (error) {
    const message = getErrorMessage(error)

    await prisma.webhookEvent.update({
      where: { id: created.id },
      data: {
        status: "FAILED",
        lastError: message,
      },
    })

    setResponseStatus(event, 400)
    return { error: message }
  }
})