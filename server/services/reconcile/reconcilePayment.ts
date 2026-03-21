import { prisma } from "~/server/lib/prisma";
import { getProviderAdapter } from "../providers/registry";
import { enqueueWebhookForPayment } from "../webhooks/enqueueWebhook";
import { applyPaymentTransition } from "~/server/services/payments/stateMachine";

export async function reconcilePayment(paymentIntentId: string) {
  const payment = await prisma.paymentIntent.findUnique({
    where: { id: paymentIntentId },
    include: { billerProfile: true },
  });

  if (!payment || !payment.billerProfile || !payment.providerCode) {
    return {
      ok: true,
      skipped: true,
      reason: "payment not reconcilable",
    };
  }

  const provider = getProviderAdapter(payment.providerCode);
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
  });

  const record = await prisma.reconciliationRecord.create({
    data: {
      paymentIntentId: payment.id,
      billerProfileId: payment.billerProfile.id,
      status:
        inquiry.status === "SUCCEEDED"
          ? "MATCHED"
          : inquiry.status === "FAILED"
            ? "MISMATCH"
            : "PENDING",
      inquiryAttemptCount: 1,
      providerReference: inquiry.providerReference ?? null,
      providerTxnId: inquiry.providerTransactionId ?? null,
      providerSnapshot: inquiry.rawResponse as any,
      internalSnapshot: {
        status: payment.status,
        providerReference: payment.providerReference,
        providerTransactionId: payment.providerTransactionId,
      } as any,
      checkedAt: new Date(),
    },
  });

  if (inquiry.status === "SUCCEEDED" && payment.status !== "SUCCEEDED") {
    const transition = await applyPaymentTransition({
      paymentIntentId: payment.id,
      toStatus: "SUCCEEDED",
      eventType: "RECONCILIATION_MATCHED",
      summary: "Payment corrected to SUCCEEDED by reconciliation",
      allowedFrom: [
        "PENDING_PROVIDER",
        "AWAITING_CUSTOMER",
        "PROCESSING",
        "FAILED",
      ],
      patch: {
        lastReconciledAt: new Date(),
        providerReference:
          inquiry.providerReference ?? payment.providerReference,
        providerTransactionId:
          inquiry.providerTransactionId ?? payment.providerTransactionId,
      },
      payload: inquiry.rawResponse as any,
    });

    if (transition.applied) {
      await enqueueWebhookForPayment(payment.id, "PAYMENT_SUCCEEDED");
      await prisma.reconciliationRecord.update({
        where: { id: record.id },
        data: {
          status: "CORRECTED",
          correctionApplied: true,
          correctionNote: "Payment corrected to SUCCEEDED",
        },
      });
    }

    return {
      ok: true,
      corrected: transition.applied,
      status: transition.payment.status,
    };
  }

  if (inquiry.status === "FAILED") {
    await prisma.reconciliationRecord.update({
      where: { id: record.id },
      data: {
        status: "MISMATCH",
        mismatchReason:
          "Provider inquiry returned FAILED while internal state is not corrected automatically",
      },
    });

    return {
      ok: true,
      corrected: false,
      status: payment.status,
      reason: "provider reported failed",
    };
  }

  return {
    ok: true,
    corrected: false,
    status: payment.status,
    reason: "reconciliation pending",
  };
}
