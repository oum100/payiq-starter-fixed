import { prisma } from "~/server/lib/prisma"
import { webhookQueue } from "~/server/lib/bullmq"
import type { PaymentEventType } from "@prisma/client"

export async function enqueueWebhookForPayment(paymentIntentId: string, eventType: PaymentEventType) {
  const payment = await prisma.paymentIntent.findUnique({ where: { id: paymentIntentId } })
  if (!payment) return

  const endpoints = await prisma.webhookEndpoint.findMany({
    where: {
      tenantId: payment.tenantId,
      status: "ACTIVE",
      subscribedEvents: { has: eventType },
    },
  })

  for (const endpoint of endpoints) {
    const delivery = await prisma.webhookDelivery.create({
      data: {
        paymentIntentId,
        webhookEndpointId: endpoint.id,
        eventType,
        status: "PENDING",
        nextAttemptAt: new Date(),
      },
    })

    await webhookQueue.add("merchant.webhook.deliver", { webhookDeliveryId: delivery.id }, { jobId: `wh_${delivery.id}_1`, removeOnComplete: 1000, removeOnFail: 1000 })
  }
}
