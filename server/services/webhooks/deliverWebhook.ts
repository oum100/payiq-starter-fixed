import { prisma } from "~/server/lib/prisma"
import { signWebhook } from "./signWebhook"
import { webhookQueue } from "~/server/lib/bullmq"

function computeNextAttempt(attemptNumber: number) {
  const base = Math.min(2 ** attemptNumber, 64)
  return new Date(Date.now() + base * 1000)
}

export async function deliverWebhook(webhookDeliveryId: string) {
  const delivery = await prisma.webhookDelivery.findUnique({
    where: { id: webhookDeliveryId },
    include: { paymentIntent: true, webhookEndpoint: true },
  })

  if (!delivery) return
  if (delivery.status === "DELIVERED" || delivery.status === "DEAD") return

  const payload = JSON.stringify({
    id: delivery.id,
    eventType: delivery.eventType,
    createdAt: delivery.createdAt.toISOString(),
    payment: {
      publicId: delivery.paymentIntent.publicId,
      status: delivery.paymentIntent.status,
      amount: delivery.paymentIntent.amount.toString(),
      currency: delivery.paymentIntent.currency,
      merchantOrderId: delivery.paymentIntent.merchantOrderId,
      merchantReference: delivery.paymentIntent.merchantReference,
      providerReference: delivery.paymentIntent.providerReference,
      providerTransactionId: delivery.paymentIntent.providerTransactionId,
    },
  })

  const signature = signWebhook(delivery.webhookEndpoint.secretHash, payload)

  await prisma.webhookDelivery.update({
    where: { id: delivery.id },
    data: {
      status: "PROCESSING",
      attemptNumber: { increment: 1 },
      requestHeaders: { "content-type": "application/json", "x-payiq-signature": signature } as any,
      requestBody: JSON.parse(payload),
      signature,
    },
  })

  try {
    const res = await fetch(delivery.webhookEndpoint.url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-payiq-signature": signature },
      body: payload,
      signal: AbortSignal.timeout(delivery.webhookEndpoint.timeoutMs),
    })
    const text = await res.text()

    if (res.ok) {
      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: { status: "DELIVERED", deliveredAt: new Date(), responseStatusCode: res.status, responseBody: text },
      })
      return
    }

    const updated = await prisma.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status: delivery.attemptNumber + 1 >= delivery.webhookEndpoint.maxAttempts ? "DEAD" : "RETRYING",
        responseStatusCode: res.status,
        responseBody: text,
        lastErrorAt: new Date(),
        errorMessage: `HTTP ${res.status}`,
        nextAttemptAt: delivery.attemptNumber + 1 >= delivery.webhookEndpoint.maxAttempts ? null : computeNextAttempt(delivery.attemptNumber + 1),
      },
    })

    if (updated.status === "RETRYING") {
      await webhookQueue.add("merchant.webhook.deliver", { webhookDeliveryId: delivery.id }, { delay: Math.max(1000, new Date(updated.nextAttemptAt!).getTime() - Date.now()), removeOnComplete: 1000, removeOnFail: 1000 })
    }
  } catch (error: any) {
    const updated = await prisma.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status: delivery.attemptNumber + 1 >= delivery.webhookEndpoint.maxAttempts ? "DEAD" : "RETRYING",
        lastErrorAt: new Date(),
        errorMessage: error?.message || "Webhook delivery failed",
        nextAttemptAt: delivery.attemptNumber + 1 >= delivery.webhookEndpoint.maxAttempts ? null : computeNextAttempt(delivery.attemptNumber + 1),
      },
    })

    if (updated.status === "RETRYING") {
      await webhookQueue.add("merchant.webhook.deliver", { webhookDeliveryId: delivery.id }, { delay: Math.max(1000, new Date(updated.nextAttemptAt!).getTime() - Date.now()), removeOnComplete: 1000, removeOnFail: 1000 })
    }
  }
}
