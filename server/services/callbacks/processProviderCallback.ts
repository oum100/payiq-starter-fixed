import { prisma } from "~/server/lib/prisma"
import { applyPaymentTransition } from "~/server/services/payments/stateMachine"
import { enqueueWebhookForPayment } from "~/server/services/webhooks/enqueueWebhook"

type CallbackProcessStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "EXPIRED"
  | null

type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null
}

function pickFirstString(values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }
  return null
}

function extractNormalizedBody(body: unknown): {
  providerReference: string | null
  providerTxnId: string | null
  externalStatus: string | null
  normalizedStatus: CallbackProcessStatus
  eventId: string | null
} {
  const bodyRecord = asRecord(body)
  const normalized = asRecord(bodyRecord?._normalized)
  const data = asRecord(bodyRecord?.data)

  const providerReference = pickFirstString([
    normalized?.providerReference,
    bodyRecord?.partnerPaymentId,
    data?.partnerPaymentId,
  ])

  const providerTxnId = pickFirstString([
    normalized?.providerTxnId,
    bodyRecord?.transactionId,
    data?.transactionId,
  ])

  const externalStatus = pickFirstString([
    normalized?.externalStatus,
    bodyRecord?.status,
    bodyRecord?.paymentStatus,
    data?.status,
    data?.paymentStatus,
  ])

  const eventId = pickFirstString([
    normalized?.eventId,
    providerTxnId,
    providerReference,
  ])

  const normalizedStatusValue = normalized?.normalizedStatus
  const normalizedStatus =
    normalizedStatusValue === "PENDING" ||
    normalizedStatusValue === "SUCCEEDED" ||
    normalizedStatusValue === "FAILED" ||
    normalizedStatusValue === "EXPIRED"
      ? normalizedStatusValue
      : null

  return {
    providerReference,
    providerTxnId,
    externalStatus,
    normalizedStatus,
    eventId,
  }
}

function isTerminalPaymentStatus(status: string): boolean {
  return ["SUCCEEDED", "FAILED", "EXPIRED", "REFUNDED", "REVERSED"].includes(status)
}

async function markProviderCallbackFailed(args: {
  callbackId: string
  paymentIntentId?: string | null
  message: string
}) {
  await prisma.providerCallback.update({
    where: { id: args.callbackId },
    data: {
      ...(args.paymentIntentId ? { paymentIntentId: args.paymentIntentId } : {}),
      processStatus: "FAILED",
      failedAt: new Date(),
      errorMessage: args.message,
    },
  })
}

export async function processProviderCallback(providerCallbackId: string) {
  const callback = await prisma.providerCallback.findUnique({
    where: { id: providerCallbackId },
  })

  if (!callback) {
    return
  }

  if (callback.processStatus === "PROCESSED" || callback.processedAt) {
    return {
      ok: true,
      skipped: true,
      reason: "already processed",
    }
  }

  if (callback.signatureValid === false) {
    await markProviderCallbackFailed({
      callbackId: callback.id,
      paymentIntentId: callback.paymentIntentId ?? null,
      message: "Invalid provider callback signature",
    })
    return
  }

  await prisma.providerCallback.update({
    where: { id: callback.id },
    data: {
      processStatus: "PROCESSING",
      errorMessage: null,
    },
  })

  const callbackAny = callback as unknown as Record<string, unknown>
  const callbackBody =
    callbackAny.body ??
    callbackAny.normalizedPayload ??
    callbackAny.payload ??
    callbackAny.normalized ??
    {}

  const normalized = extractNormalizedBody(callbackBody)

  const providerTxnId =
    callback.providerTxnId || normalized.providerTxnId
  const providerReference =
    callback.providerReference || normalized.providerReference

  const orConditions: Array<Record<string, string>> = []

  if (providerTxnId) {
    orConditions.push({ providerTransactionId: providerTxnId })
  }

  if (providerReference) {
    orConditions.push({ publicId: providerReference })
    orConditions.push({ providerReference })
  }

  const payment =
    orConditions.length > 0
      ? await prisma.paymentIntent.findFirst({
          where: { OR: orConditions },
        })
      : null

  if (!payment) {
    await markProviderCallbackFailed({
      callbackId: callback.id,
      message: "Payment intent not found for callback",
    })
    return
  }

  const currentStatus = String(payment.status)
  const normalizedStatus = normalized.normalizedStatus

  if (isTerminalPaymentStatus(currentStatus)) {
    await prisma.providerCallback.update({
      where: { id: callback.id },
      data: {
        paymentIntentId: payment.id,
        processStatus: "PROCESSED",
        processedAt: new Date(),
        errorMessage: null,
      },
    })

    return {
      ok: true,
      skipped: true,
      reason: "payment already final",
    }
  }

  if (normalizedStatus === "PENDING") {
    await applyPaymentTransition({
      paymentIntentId: payment.id,
      toStatus: "PROCESSING",
      eventType: "PROVIDER_CALLBACK_RECEIVED",
      summary: "Provider callback received",
      allowedFrom: ["AWAITING_CUSTOMER", "PENDING_PROVIDER", "PROCESSING"],
      patch: {
        ...(providerReference ? { providerReference } : {}),
        ...(providerTxnId ? { providerTransactionId: providerTxnId } : {}),
      },
      payload: {
        callbackId: callback.id,
        providerCallbackId: callback.id,
        providerReference,
        providerTxnId,
        externalStatus: normalized.externalStatus,
        normalizedStatus,
        eventId: normalized.eventId,
        body: callbackBody,
      },
    })
  } else if (
    normalizedStatus === "SUCCEEDED" ||
    normalizedStatus === "FAILED" ||
    normalizedStatus === "EXPIRED"
  ) {
    const eventType =
      normalizedStatus === "SUCCEEDED"
        ? "PAYMENT_SUCCEEDED"
        : normalizedStatus === "FAILED"
          ? "PAYMENT_FAILED"
          : "PAYMENT_EXPIRED"

    const summary =
      normalizedStatus === "SUCCEEDED"
        ? "Payment marked successful from provider callback"
        : normalizedStatus === "FAILED"
          ? "Payment marked failed from provider callback"
          : "Payment marked expired from provider callback"

    const transitioned = await applyPaymentTransition({
      paymentIntentId: payment.id,
      toStatus: normalizedStatus,
      eventType,
      summary,
      allowedFrom: [
        "CREATED",
        "ROUTING",
        "PENDING_PROVIDER",
        "AWAITING_CUSTOMER",
        "PROCESSING",
      ],
      patch: {
        ...(providerReference ? { providerReference } : {}),
        ...(providerTxnId ? { providerTransactionId: providerTxnId } : {}),
        ...(normalizedStatus === "SUCCEEDED" ? { succeededAt: new Date() } : {}),
        ...(normalizedStatus === "FAILED" ? { failedAt: new Date() } : {}),
        ...(normalizedStatus === "EXPIRED" ? { expiredAt: new Date() } : {}),
      },
      payload: {
        callbackId: callback.id,
        providerCallbackId: callback.id,
        providerReference,
        providerTxnId,
        externalStatus: normalized.externalStatus,
        normalizedStatus,
        eventId: normalized.eventId,
        body: callbackBody,
      },
    })

    if (normalizedStatus === "SUCCEEDED") {
      await enqueueWebhookForPayment(transitioned.payment.id, "PAYMENT_SUCCEEDED")
    } else if (normalizedStatus === "FAILED") {
      await enqueueWebhookForPayment(transitioned.payment.id, "PAYMENT_FAILED")
    } else if (normalizedStatus === "EXPIRED") {
      await enqueueWebhookForPayment(transitioned.payment.id, "PAYMENT_EXPIRED")
    }
  }

  await prisma.providerCallback.update({
    where: { id: callback.id },
    data: {
      paymentIntentId: payment.id,
      processStatus: "PROCESSED",
      processedAt: new Date(),
      errorMessage: null,
    },
  })

  return {
    ok: true,
  }
}