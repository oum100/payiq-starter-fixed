import type { PaymentEventType } from "@prisma/client";
import { prisma } from "~/server/lib/prisma";
import {
  applyPaymentTransition,
  type PaymentEventTypeValue,
} from "~/server/services/payments/stateMachine";
import { enqueueWebhookForPayment } from "../webhooks/enqueueWebhook";

type CallbackProcessStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "EXPIRED"
  | null;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function pickFirstString(values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function extractNormalizedBody(body: unknown): {
  providerReference: string | null;
  providerTxnId: string | null;
  externalStatus: string | null;
  normalizedStatus: CallbackProcessStatus;
  eventId: string | null;
} {
  const bodyRecord = asRecord(body);
  const normalized = asRecord(bodyRecord?._normalized);
  const data = asRecord(bodyRecord?.data);

  const providerReference = pickFirstString([
    normalized?.providerReference,
    bodyRecord?.partnerPaymentId,
    data?.partnerPaymentId,
  ]);

  const providerTxnId = pickFirstString([
    normalized?.providerTxnId,
    bodyRecord?.transactionId,
    data?.transactionId,
  ]);

  const externalStatus = pickFirstString([
    normalized?.externalStatus,
    bodyRecord?.status,
    bodyRecord?.paymentStatus,
    data?.status,
    data?.paymentStatus,
  ]);

  const eventId = pickFirstString([
    normalized?.eventId,
    providerTxnId,
    providerReference,
  ]);

  const normalizedStatusValue = normalized?.normalizedStatus;
  const normalizedStatus =
    normalizedStatusValue === "PENDING" ||
    normalizedStatusValue === "SUCCEEDED" ||
    normalizedStatusValue === "FAILED" ||
    normalizedStatusValue === "EXPIRED"
      ? normalizedStatusValue
      : null;

  return {
    providerReference,
    providerTxnId,
    externalStatus,
    normalizedStatus,
    eventId,
  };
}

function isTerminalPaymentStatus(status: string): boolean {
  return ["SUCCEEDED", "FAILED", "EXPIRED", "REFUNDED", "REVERSED"].includes(
    status,
  );
}

function mapWebhookEventType(
  status: Exclude<CallbackProcessStatus, null>,
): PaymentEventTypeValue {
  switch (status) {
    case "SUCCEEDED":
      return "PAYMENT_SUCCEEDED";
    case "FAILED":
      return "PAYMENT_FAILED";
    case "EXPIRED":
      return "PAYMENT_EXPIRED";
    case "PENDING":
      return "PROVIDER_CALLBACK_RECEIVED";
  }
}

function mapWebhookSummary(
  status: Exclude<CallbackProcessStatus, null>,
): string {
  switch (status) {
    case "SUCCEEDED":
      return "Payment marked successful from provider callback";
    case "FAILED":
      return "Payment marked failed from provider callback";
    case "EXPIRED":
      return "Payment marked expired from provider callback";
    case "PENDING":
      return "Provider callback received";
  }
}

function mapWebhookName(
  status: CallbackProcessStatus,
): PaymentEventType | null {
  switch (status) {
    case "SUCCEEDED":
      return "PAYMENT_SUCCEEDED";
    case "FAILED":
      return "PAYMENT_FAILED";
    case "EXPIRED":
      return "PAYMENT_EXPIRED";
    default:
      return null;
  }
}

async function markProviderCallbackFailed(args: {
  callbackId: string;
  paymentIntentId?: string | null;
  message: string;
}) {
  await prisma.providerCallback.update({
    where: { id: args.callbackId },
    data: {
      ...(args.paymentIntentId
        ? { paymentIntentId: args.paymentIntentId }
        : {}),
      processStatus: "FAILED",
      failedAt: new Date(),
      errorMessage: args.message,
    },
  });
}

export async function processProviderCallback(providerCallbackId: string) {
  const callback = await prisma.providerCallback.findUnique({
    where: { id: providerCallbackId },
  });

  if (!callback) {
    return;
  }

  if (callback.processStatus === "PROCESSED") {
    return;
  }

  if (callback.signatureValid === false) {
    await markProviderCallbackFailed({
      callbackId: callback.id,
      paymentIntentId: callback.paymentIntentId ?? null,
      message: "Invalid provider callback signature",
    });
    return;
  }

  await prisma.providerCallback.update({
    where: { id: callback.id },
    data: {
      processStatus: "PROCESSING",
      errorMessage: null,
    },
  });

  const normalized = extractNormalizedBody(callback.body);

  const providerTxnId = callback.providerTxnId || normalized.providerTxnId;
  const providerReference =
    callback.providerReference || normalized.providerReference;

  const orConditions: Array<Record<string, string>> = [];

  if (providerTxnId) {
    orConditions.push({ providerTransactionId: providerTxnId });
  }

  if (providerReference) {
    orConditions.push({ publicId: providerReference });
    orConditions.push({ providerReference });
  }

  const payment =
    orConditions.length > 0
      ? await prisma.paymentIntent.findFirst({
          where: { OR: orConditions },
        })
      : null;

  if (!payment) {
    await markProviderCallbackFailed({
      callbackId: callback.id,
      message: "Payment intent not found for callback",
    });
    return;
  }

  const normalizedStatus = normalized.normalizedStatus;
  const currentStatus = String(payment.status);

  if (!isTerminalPaymentStatus(currentStatus) && normalizedStatus) {
    if (normalizedStatus === "PENDING") {
      await applyPaymentTransition({
        paymentIntentId: payment.id,
        toStatus: "PROCESSING",
        eventType: mapWebhookEventType(normalizedStatus),
        summary: mapWebhookSummary(normalizedStatus),
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
          body: callback.body,
        },
      });
    } else {
      const transitioned = await applyPaymentTransition({
        paymentIntentId: payment.id,
        toStatus: normalizedStatus,
        eventType: mapWebhookEventType(normalizedStatus),
        summary: mapWebhookSummary(normalizedStatus),
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
          ...(normalizedStatus === "SUCCEEDED"
            ? { succeededAt: new Date() }
            : {}),
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
          body: callback.body,
        },
      });

      const webhookEvent = mapWebhookName(normalizedStatus);
      if (webhookEvent) {
        await enqueueWebhookForPayment(transitioned.payment.id, webhookEvent);
      }
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
  });
}
