import { prisma } from "~/server/lib/prisma"

type ProviderPayload = Record<string, any>

function parsePayload(raw: string): ProviderPayload {
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error("invalid webhook payload")
  }
}

async function processScbWebhook(webhookEventId: string, payload: ProviderPayload) {
  const externalRef =
    payload.transactionId ||
    payload.paymentIntentId ||
    payload.reference ||
    payload.ref ||
    null

  await prisma.webhookEvent.update({
    where: { id: webhookEventId },
    data: {
      status: "PROCESSED",
      processedAt: new Date(),
      processingAttempts: { increment: 1 },
      lastError: null,
    },
  })

  return {
    ok: true,
    provider: "scb",
    externalRef,
    eventType: payload.eventType || payload.status || "unknown",
  }
}

async function processKbankWebhook(webhookEventId: string, payload: ProviderPayload) {
  const externalRef =
    payload.transactionId ||
    payload.paymentIntentId ||
    payload.reference ||
    payload.ref ||
    null

  await prisma.webhookEvent.update({
    where: { id: webhookEventId },
    data: {
      status: "PROCESSED",
      processedAt: new Date(),
      processingAttempts: { increment: 1 },
      lastError: null,
    },
  })

  return {
    ok: true,
    provider: "kbank",
    externalRef,
    eventType: payload.eventType || payload.status || "unknown",
  }
}

export async function processWebhookEvent(webhookEventId: string) {
  const webhookEvent = await prisma.webhookEvent.findUnique({
    where: { id: webhookEventId },
    select: {
      id: true,
      provider: true,
      eventId: true,
      payload: true,
      status: true,
      processedAt: true,
    },
  })

  if (!webhookEvent) {
    throw new Error("webhook event not found")
  }

  if (webhookEvent.processedAt || webhookEvent.status === "PROCESSED") {
    return {
      ok: true,
      skipped: true,
      reason: "already processed",
    }
  }

  const payload = parsePayload(webhookEvent.payload)

  switch (webhookEvent.provider) {
    case "scb":
      return processScbWebhook(webhookEvent.id, payload)
    case "kbank":
      return processKbankWebhook(webhookEvent.id, payload)
    default: {
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          status: "FAILED",
          processingAttempts: { increment: 1 },
          lastError: "unknown provider",
        },
      })
      throw new Error("unknown provider")
    }
  }
}