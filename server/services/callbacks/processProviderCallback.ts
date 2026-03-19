import { prisma } from "~/server/lib/prisma"
import { enqueueWebhookForPayment } from "../webhooks/enqueueWebhook"

function inferPaymentStatus(body: any): "SUCCEEDED" | "FAILED" | "PROCESSING" {
  const status = String(body?.status || body?.paymentStatus || "").toUpperCase()
  if (["SUCCESS", "PAID", "COMPLETED"].includes(status)) return "SUCCEEDED"
  if (["FAILED", "REJECTED"].includes(status)) return "FAILED"
  return "PROCESSING"
}

export async function processProviderCallback(providerCallbackId: string) {
  const callback = await prisma.providerCallback.findUnique({ where: { id: providerCallbackId } })
  if (!callback) return
  if (callback.processStatus === "PROCESSED") return

  await prisma.providerCallback.update({ where: { id: callback.id }, data: { processStatus: "PROCESSING" } })

  const body = callback.body as any
  const providerTxnId = callback.providerTxnId || body?.transactionId || body?.data?.transactionId || null
  const providerReference = callback.providerReference || body?.partnerPaymentId || body?.data?.partnerPaymentId || null

  const ors = [] as any[]
  if (providerTxnId) ors.push({ providerTransactionId: providerTxnId })
  if (providerReference) ors.push({ publicId: providerReference }, { providerReference })

  const payment = ors.length ? await prisma.paymentIntent.findFirst({ where: { OR: ors } }) : null

  if (!payment) {
    await prisma.providerCallback.update({ where: { id: callback.id }, data: { processStatus: "FAILED", failedAt: new Date(), errorMessage: "Payment intent not found for callback" } })
    return
  }

  const inferred = inferPaymentStatus(body)

  if (inferred === "SUCCEEDED" && !["SUCCEEDED", "REFUNDED", "REVERSED"].includes(payment.status)) {
    await prisma.paymentIntent.update({
      where: { id: payment.id },
      data: {
        status: "SUCCEEDED",
        succeededAt: new Date(),
        events: {
          create: [
            { type: "PROVIDER_CALLBACK_RECEIVED", fromStatus: payment.status, toStatus: "PROCESSING", summary: "Provider callback received", payload: body },
            { type: "PAYMENT_SUCCEEDED", fromStatus: payment.status, toStatus: "SUCCEEDED", summary: "Payment marked successful from provider callback" },
          ],
        },
      },
    })
    await enqueueWebhookForPayment(payment.id, "PAYMENT_SUCCEEDED")
  } else if (inferred === "FAILED" && !["SUCCEEDED", "FAILED"].includes(payment.status)) {
    await prisma.paymentIntent.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        events: { create: [{ type: "PAYMENT_FAILED", fromStatus: payment.status, toStatus: "FAILED", summary: "Payment marked failed from provider callback", payload: body }] },
      },
    })
    await enqueueWebhookForPayment(payment.id, "PAYMENT_FAILED")
  }

  await prisma.providerCallback.update({ where: { id: callback.id }, data: { paymentIntentId: payment.id, processStatus: "PROCESSED", processedAt: new Date() } })
}
