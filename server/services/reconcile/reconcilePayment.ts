import { prisma } from "~/server/lib/prisma"
import { applyPaymentTransition } from "~/server/services/payments/stateMachine"
import { getProviderAdapter } from "../providers/registry"
import { enqueueWebhookForPayment } from "../webhooks/enqueueWebhook"

type ReconcileResult = {
  ok: true
  skipped?: boolean
  corrected?: boolean
  status?: string
  reason?: string
}

function mapReconciliationStatus(
  inquiryStatus: "PENDING" | "SUCCEEDED" | "FAILED" | "EXPIRED",
): "MATCHED" | "MISMATCH" | "PENDING" {
  if (inquiryStatus === "SUCCEEDED") return "MATCHED"
  if (inquiryStatus === "FAILED" || inquiryStatus === "EXPIRED") return "MISMATCH"
  return "PENDING"
}

function isAlreadyFinal(status: string): boolean {
  return ["SUCCEEDED", "FAILED", "EXPIRED", "REFUNDED", "REVERSED"].includes(status)
}

export async function reconcilePayment(paymentIntentId: string): Promise<ReconcileResult> {
  const payment = await prisma.paymentIntent.findUnique({
    where: { id: paymentIntentId },
    include: { billerProfile: true },
  })

  if (!payment || !payment.billerProfile || !payment.providerCode) {
    return {
      ok: true,
      skipped: true,
      reason: "payment not reconcilable",
    }
  }

  const provider = getProviderAdapter(payment.providerCode)

  const inquiry = await provider.inquirePayment({
    providerReference: payment.providerReference,
    providerTransactionId: payment.providerTransactionId,
    billerProfile: {
      id: payment.billerProfile.id,
      providerCode: payment.billerProfile.providerCode,
      billerId: payment.billerProfile.billerId,
      merchantIdAtProvider: payment.billerProfile.merchantIdAtProvider,
      credentialsEncrypted: payment.billerProfile.credentialsEncrypted,
      config: payment.billerProfile.config,
    },
  })

  const baseRecord = await prisma.reconciliationRecord.create({
    data: {
      paymentIntentId: payment.id,
      billerProfileId: payment.billerProfile.id,
      status: mapReconciliationStatus(inquiry.status),
      inquiryAttemptCount: 1,
      providerReference: inquiry.providerReference ?? null,
      providerTxnId: inquiry.providerTransactionId ?? null,
      providerSnapshot: (inquiry.rawResponse ?? null) as never,
      internalSnapshot: {
        status: payment.status,
        providerReference: payment.providerReference,
        providerTransactionId: payment.providerTransactionId,
      } as never,
      checkedAt: new Date(),
    },
  })

  if (inquiry.status === "SUCCEEDED") {
    if (payment.status === "SUCCEEDED") {
      await prisma.reconciliationRecord.update({
        where: { id: baseRecord.id },
        data: {
          status: "MATCHED",
          correctionApplied: false,
          correctionNote: "Internal and provider state already match",
        },
      })

      await prisma.paymentIntent.update({
        where: { id: payment.id },
        data: {
          lastReconciledAt: new Date(),
          providerReference: inquiry.providerReference ?? payment.providerReference,
          providerTransactionId:
            inquiry.providerTransactionId ?? payment.providerTransactionId,
        },
      })

      return {
        ok: true,
        corrected: false,
        status: payment.status,
        reason: "already matched",
      }
    }

    const transition = await applyPaymentTransition({
      paymentIntentId: payment.id,
      toStatus: "SUCCEEDED",
      eventType: "RECONCILIATION_MATCHED",
      summary: "Payment corrected to SUCCEEDED by reconciliation",
      allowedFrom: [
        "CREATED",
        "ROUTING",
        "PENDING_PROVIDER",
        "AWAITING_CUSTOMER",
        "PROCESSING",
        "FAILED",
      ],
      patch: {
        lastReconciledAt: new Date(),
        providerReference: inquiry.providerReference ?? payment.providerReference,
        providerTransactionId:
          inquiry.providerTransactionId ?? payment.providerTransactionId,
      },
      payload:
        (inquiry.rawResponse as Record<string, unknown> | null) ?? {
          providerStatus: inquiry.status,
        },
    })

    if (transition.applied) {
      await enqueueWebhookForPayment(payment.id, "PAYMENT_SUCCEEDED")

      await prisma.reconciliationRecord.update({
        where: { id: baseRecord.id },
        data: {
          status: "CORRECTED",
          correctionApplied: true,
          correctionNote: "Payment corrected to SUCCEEDED",
        },
      })
    }

    return {
      ok: true,
      corrected: transition.applied,
      status: transition.payment.status,
    }
  }

  if (inquiry.status === "FAILED") {
    await prisma.reconciliationRecord.update({
      where: { id: baseRecord.id },
      data: {
        status: "MISMATCH",
        correctionApplied: false,
        mismatchReason:
          "Provider inquiry returned FAILED while internal state is not corrected automatically",
      },
    })

    return {
      ok: true,
      corrected: false,
      status: payment.status,
      reason: "provider reported failed",
    }
  }

  if (inquiry.status === "EXPIRED") {
    if (payment.status === "EXPIRED") {
      await prisma.reconciliationRecord.update({
        where: { id: baseRecord.id },
        data: {
          status: "MATCHED",
          correctionApplied: false,
          correctionNote: "Internal and provider state already expired",
        },
      })

      await prisma.paymentIntent.update({
        where: { id: payment.id },
        data: {
          lastReconciledAt: new Date(),
          providerReference: inquiry.providerReference ?? payment.providerReference,
          providerTransactionId:
            inquiry.providerTransactionId ?? payment.providerTransactionId,
        },
      })

      return {
        ok: true,
        corrected: false,
        status: payment.status,
        reason: "already expired",
      }
    }

    if (!isAlreadyFinal(payment.status)) {
      const transition = await applyPaymentTransition({
        paymentIntentId: payment.id,
        toStatus: "EXPIRED",
        eventType: "RECONCILIATION_MISMATCH",
        summary: "Payment corrected to EXPIRED by reconciliation",
        allowedFrom: [
          "CREATED",
          "ROUTING",
          "PENDING_PROVIDER",
          "AWAITING_CUSTOMER",
          "PROCESSING",
        ],
        patch: {
          lastReconciledAt: new Date(),
          providerReference: inquiry.providerReference ?? payment.providerReference,
          providerTransactionId:
            inquiry.providerTransactionId ?? payment.providerTransactionId,
          expiredAt: new Date(),
        },
        payload:
          (inquiry.rawResponse as Record<string, unknown> | null) ?? {
            providerStatus: inquiry.status,
          },
      })

      if (transition.applied) {
        await enqueueWebhookForPayment(payment.id, "PAYMENT_EXPIRED")

        await prisma.reconciliationRecord.update({
          where: { id: baseRecord.id },
          data: {
            status: "CORRECTED",
            correctionApplied: true,
            correctionNote: "Payment corrected to EXPIRED",
          },
        })
      }

      return {
        ok: true,
        corrected: transition.applied,
        status: transition.payment.status,
      }
    }

    await prisma.reconciliationRecord.update({
      where: { id: baseRecord.id },
      data: {
        status: "MISMATCH",
        correctionApplied: false,
        mismatchReason:
          "Provider inquiry returned EXPIRED while internal state is already terminal and not auto-corrected",
      },
    })

    return {
      ok: true,
      corrected: false,
      status: payment.status,
      reason: "provider reported expired",
    }
  }

  await prisma.reconciliationRecord.update({
    where: { id: baseRecord.id },
    data: {
      status: "PENDING",
      correctionApplied: false,
      correctionNote: "Provider inquiry still pending",
    },
  })

  await prisma.paymentIntent.update({
    where: { id: payment.id },
    data: {
      lastReconciledAt: new Date(),
      providerReference: inquiry.providerReference ?? payment.providerReference,
      providerTransactionId:
        inquiry.providerTransactionId ?? payment.providerTransactionId,
    },
  })

  return {
    ok: true,
    corrected: false,
    status: payment.status,
    reason: "reconciliation pending",
  }
}