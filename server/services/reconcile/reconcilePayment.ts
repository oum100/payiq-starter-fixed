import { prisma } from "~/server/lib/prisma"
import { getProviderAdapter } from "../providers/registry"
import { enqueueWebhookForPayment } from "../webhooks/enqueueWebhook"

export async function reconcilePayment(paymentIntentId: string) {
  const payment = await prisma.paymentIntent.findUnique({ where: { id: paymentIntentId }, include: { billerProfile: true } })
  if (!payment || !payment.billerProfile || !payment.providerCode) return

  const provider = getProviderAdapter(payment.providerCode)
  const inquiry = await provider.inquirePayment({
    providerReference: payment.providerReference,
    providerTransactionId: payment.providerTransactionId,
    billerProfile: {
      id: payment.billerProfile.id,
      providerCode: payment.billerProfile.providerCode,
      billerId: payment.billerProfile.billerId,
      credentialsEncrypted: payment.billerProfile.credentialsEncrypted,
      config: payment.billerProfile.config,
    },
  })

  const record = await prisma.reconciliationRecord.create({
    data: {
      paymentIntentId: payment.id,
      billerProfileId: payment.billerProfile.id,
      status: inquiry.status === "SUCCEEDED" ? "MATCHED" : inquiry.status === "FAILED" ? "MISMATCH" : "PENDING",
      inquiryAttemptCount: 1,
      providerReference: inquiry.providerReference,
      providerTxnId: inquiry.providerTransactionId,
      providerSnapshot: inquiry.rawResponse as any,
      internalSnapshot: { status: payment.status, providerReference: payment.providerReference, providerTransactionId: payment.providerTransactionId } as any,
      checkedAt: new Date(),
    },
  })

  if (inquiry.status === "SUCCEEDED" && payment.status !== "SUCCEEDED") {
    await prisma.paymentIntent.update({
      where: { id: payment.id },
      data: {
        status: "SUCCEEDED",
        succeededAt: new Date(),
        lastReconciledAt: new Date(),
        events: { create: { type: "RECONCILIATION_MATCHED", fromStatus: payment.status, toStatus: "SUCCEEDED", summary: "Payment corrected to SUCCEEDED by reconciliation", payload: inquiry.rawResponse as any } },
      },
    })
    await enqueueWebhookForPayment(payment.id, "PAYMENT_SUCCEEDED")
    await prisma.reconciliationRecord.update({ where: { id: record.id }, data: { status: "CORRECTED", correctionApplied: true, correctionNote: "Payment corrected to SUCCEEDED" } })
  }
}
