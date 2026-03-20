import { prisma } from "~/server/lib/prisma";
import { enqueueWebhookForPayment } from "~/server/services/webhooks/enqueueWebhook";
import { applyPaymentTransition } from "~/server/services/payments/stateMachine";

type ProviderPayload = Record<string, any>;

type NormalizedWebhookResult = {
  provider: "scb" | "kbank";
  providerCode: "SCB" | "KBANK";
  externalRef: string | null;
  providerReference: string | null;
  providerTransactionId: string | null;
  merchantReference: string | null;
  publicId: string | null;
  eventType: string;
  normalizedStatus: "SUCCEEDED" | "FAILED" | "PENDING";
  rawPayload: ProviderPayload;
};

function parsePayload(raw: string): ProviderPayload {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("invalid webhook payload");
  }
}

function normalizeProviderCode(provider: string): "SCB" | "KBANK" | null {
  switch (provider.toLowerCase()) {
    case "scb":
      return "SCB";
    case "kbank":
      return "KBANK";
    default:
      return null;
  }
}

function getFirstString(...values: any[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function normalizeIncomingStatus(payload: ProviderPayload) {
  const raw = String(
    payload.eventType ??
      payload.status ??
      payload.paymentStatus ??
      payload.transactionStatus ??
      "",
  )
    .trim()
    .toUpperCase();

  if (
    [
      "SUCCESS",
      "SUCCEEDED",
      "COMPLETED",
      "PAID",
      "PAYMENT_CONFIRMED",
    ].includes(raw)
  ) {
    return "SUCCEEDED" as const;
  }

  if (
    [
      "FAILED",
      "FAIL",
      "DECLINED",
      "ERROR",
      "CANCELLED",
      "CANCELED",
      "EXPIRED",
    ].includes(raw)
  ) {
    return "FAILED" as const;
  }

  return "PENDING" as const;
}

function normalizeWebhook(
  provider: "scb" | "kbank",
  payload: ProviderPayload,
): NormalizedWebhookResult {
  const providerCode = provider === "scb" ? "SCB" : "KBANK";

  const providerReference = getFirstString(
    payload.providerReference,
    payload.reference,
    payload.ref,
    payload.orderRef,
    payload.orderId,
  );

  const providerTransactionId = getFirstString(
    payload.providerTransactionId,
    payload.transactionId,
    payload.txnId,
    payload.paymentIntentId,
  );

  const publicId = getFirstString(
    payload.publicId,
    payload.paymentPublicId,
  );

  const merchantReference = getFirstString(
    payload.merchantReference,
    payload.merchantOrderId,
    payload.orderRef1,
  );

  const externalRef =
    providerTransactionId ??
    providerReference ??
    publicId ??
    merchantReference;

  return {
    provider,
    providerCode,
    externalRef,
    providerReference,
    providerTransactionId,
    merchantReference,
    publicId,
    eventType: String(
      payload.eventType ?? payload.status ?? payload.paymentStatus ?? "unknown",
    ),
    normalizedStatus: normalizeIncomingStatus(payload),
    rawPayload: payload,
  };
}

async function findPaymentForWebhook(input: NormalizedWebhookResult) {
  const or: Record<string, any>[] = [];

  if (input.providerReference) {
    or.push({
      providerReference: input.providerReference,
    });
  }

  if (input.providerTransactionId) {
    or.push({
      providerTransactionId: input.providerTransactionId,
    });
  }

  if (input.publicId) {
    or.push({
      publicId: input.publicId,
    });
  }

  if (input.merchantReference) {
    or.push({
      merchantReference: input.merchantReference,
    });
  }

  if (!or.length) {
    return null;
  }

  return prisma.paymentIntent.findFirst({
    where: {
      providerCode: input.providerCode,
      OR: or,
    },
  });
}

async function markWebhookProcessed(
  webhookEventId: string,
  lastError: string | null = null,
) {
  await prisma.webhookEvent.update({
    where: { id: webhookEventId },
    data: {
      status: "PROCESSED",
      processedAt: new Date(),
      processingAttempts: { increment: 1 },
      lastError,
    },
  });
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
  });

  if (!webhookEvent) {
    throw new Error("webhook event not found");
  }

  if (webhookEvent.processedAt || webhookEvent.status === "PROCESSED") {
    return {
      ok: true,
      skipped: true,
      reason: "already processed",
    };
  }

  const providerCode = normalizeProviderCode(webhookEvent.provider);

  if (!providerCode) {
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        status: "FAILED",
        processingAttempts: { increment: 1 },
        lastError: "unknown provider",
      },
    });
    throw new Error("unknown provider");
  }

  const payload = parsePayload(webhookEvent.payload);
  const normalized = normalizeWebhook(
    webhookEvent.provider.toLowerCase() as "scb" | "kbank",
    payload,
  );

  const payment = await findPaymentForWebhook(normalized);

  if (!payment) {
    await markWebhookProcessed(webhookEvent.id, "payment not found");
    return {
      ok: true,
      skipped: true,
      reason: "payment not found",
    };
  }

  if (
    normalized.normalizedStatus === "PENDING" &&
    ["SUCCEEDED", "FAILED", "CANCELLED", "EXPIRED", "REVERSED", "REFUNDED"].includes(
      payment.status,
    )
  ) {
    await markWebhookProcessed(webhookEvent.id, "terminal payment unchanged");
    return {
      ok: true,
      skipped: true,
      reason: "terminal payment unchanged",
    };
  }

  const transition =
    normalized.normalizedStatus === "SUCCEEDED"
      ? await applyPaymentTransition({
          paymentIntentId: payment.id,
          toStatus: "SUCCEEDED",
          eventType: "PAYMENT_SUCCEEDED",
          summary: "Provider webhook marked payment as SUCCEEDED",
          allowedFrom: ["PENDING_PROVIDER", "AWAITING_CUSTOMER", "PROCESSING"],
          patch: {
            providerReference:
              normalized.providerReference ?? payment.providerReference,
            providerTransactionId:
              normalized.providerTransactionId ?? payment.providerTransactionId,
          },
          payload: {
            provider: normalized.provider,
            eventType: normalized.eventType,
            externalRef: normalized.externalRef,
            webhookEventId: webhookEvent.id,
          },
        })
      : normalized.normalizedStatus === "FAILED"
        ? await applyPaymentTransition({
            paymentIntentId: payment.id,
            toStatus: "FAILED",
            eventType: "PAYMENT_FAILED",
            summary: "Provider webhook marked payment as FAILED",
            allowedFrom: ["PENDING_PROVIDER", "AWAITING_CUSTOMER", "PROCESSING"],
            payload: {
              provider: normalized.provider,
              eventType: normalized.eventType,
              externalRef: normalized.externalRef,
              webhookEventId: webhookEvent.id,
            },
          })
        : await applyPaymentTransition({
            paymentIntentId: payment.id,
            toStatus: "PROCESSING",
            eventType: "PAYMENT_PENDING",
            summary: "Provider webhook marked payment as PROCESSING",
            allowedFrom: ["PENDING_PROVIDER", "AWAITING_CUSTOMER"],
            payload: {
              provider: normalized.provider,
              eventType: normalized.eventType,
              externalRef: normalized.externalRef,
              webhookEventId: webhookEvent.id,
            },
          });

  await markWebhookProcessed(webhookEvent.id);

  if (
    transition.applied &&
    (transition.payment.status === "SUCCEEDED" ||
      transition.payment.status === "FAILED")
  ) {
    await enqueueWebhookForPayment(
      transition.payment.id,
      transition.payment.status === "SUCCEEDED"
        ? "PAYMENT_SUCCEEDED"
        : "PAYMENT_FAILED",
    );
  }

  return {
    ok: true,
    provider: normalized.provider,
    externalRef: normalized.externalRef,
    eventType: normalized.eventType,
  };
}