import { prisma } from "~/server/lib/prisma";

export type PaymentIntentStatusValue =
  | "CREATED"
  | "ROUTING"
  | "PENDING_PROVIDER"
  | "AWAITING_CUSTOMER"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "REVERSED"
  | "REFUNDED";

export type PaymentEventTypeValue =
  | "PAYMENT_CREATED"
  | "ROUTE_RESOLVED"
  | "PROVIDER_REQUESTED"
  | "PROVIDER_ACCEPTED"
  | "PROVIDER_REJECTED"
  | "PROVIDER_CALLBACK_RECEIVED"
  | "PROVIDER_CALLBACK_PROCESSED"
  | "PAYMENT_PENDING"
  | "PAYMENT_SUCCEEDED"
  | "PAYMENT_FAILED"
  | "PAYMENT_CANCELLED"
  | "PAYMENT_EXPIRED"
  | "PAYMENT_REVERSED"
  | "PAYMENT_REFUNDED"
  | "WEBHOOK_QUEUED"
  | "WEBHOOK_DELIVERED"
  | "WEBHOOK_FAILED"
  | "RECONCILIATION_REQUESTED"
  | "RECONCILIATION_MATCHED"
  | "RECONCILIATION_MISMATCH"
  | "MANUAL_NOTE";

const DEFAULT_TRANSITIONS: Record<
  PaymentIntentStatusValue,
  PaymentIntentStatusValue[]
> = {
  CREATED: ["ROUTING", "PENDING_PROVIDER", "FAILED", "CANCELLED"],
  ROUTING: ["PENDING_PROVIDER", "FAILED", "CANCELLED"],
  PENDING_PROVIDER: [
    "AWAITING_CUSTOMER",
    "PROCESSING",
    "FAILED",
    "CANCELLED",
    "EXPIRED",
  ],
  AWAITING_CUSTOMER: [
    "PROCESSING",
    "SUCCEEDED",
    "FAILED",
    "EXPIRED",
    "CANCELLED",
  ],
  PROCESSING: ["SUCCEEDED", "FAILED", "EXPIRED", "REVERSED", "REFUNDED"],
  SUCCEEDED: ["REVERSED", "REFUNDED"],
  FAILED: [],
  CANCELLED: [],
  EXPIRED: [],
  REVERSED: [],
  REFUNDED: [],
};

type TransitionInput = {
  paymentIntentId: string;
  toStatus: PaymentIntentStatusValue;
  eventType: PaymentEventTypeValue;
  summary: string;
  payload?: Record<string, any> | null;
  allowedFrom?: PaymentIntentStatusValue[];
  patch?: Record<string, any>;
};

type TransitionResult = {
  applied: boolean;
  reason?: "NOOP";
  payment: any;
};

export function canTransition(
  fromStatus: PaymentIntentStatusValue,
  toStatus: PaymentIntentStatusValue,
  allowedFrom?: PaymentIntentStatusValue[],
) {
  if (fromStatus === toStatus) return true;

  if (allowedFrom && allowedFrom.length > 0) {
    return allowedFrom.includes(fromStatus);
  }

  const allowedToStatuses = DEFAULT_TRANSITIONS[fromStatus] ?? [];
  return allowedToStatuses.includes(toStatus);
}

function buildStatusPatch(
  toStatus: PaymentIntentStatusValue,
  patch?: Record<string, any>,
) {
  const now = new Date();

  const base: Record<string, any> = {
    status: toStatus,
    ...(patch ?? {}),
  };

  if (toStatus === "SUCCEEDED" && !base.succeededAt) {
    base.succeededAt = now;
  }

  if (toStatus === "FAILED" && !base.failedAt) {
    base.failedAt = now;
  }

  if (toStatus === "CANCELLED" && !base.cancelledAt) {
    base.cancelledAt = now;
  }

  return base;
}

export async function applyPaymentTransition(
  input: TransitionInput,
): Promise<TransitionResult> {
  return prisma.$transaction(async (tx) => {
    const current = await tx.paymentIntent.findUnique({
      where: { id: input.paymentIntentId },
    });

    if (!current) {
      throw new Error(`payment intent not found: ${input.paymentIntentId}`);
    }

    const currentStatus = current.status as PaymentIntentStatusValue;

    if (currentStatus === input.toStatus) {
      return {
        applied: false,
        reason: "NOOP",
        payment: current,
      };
    }

    if (!canTransition(currentStatus, input.toStatus, input.allowedFrom)) {
      throw new Error(
        `invalid payment transition: ${currentStatus} -> ${input.toStatus}`,
      );
    }

    const updatedCount = await tx.paymentIntent.updateMany({
      where: {
        id: current.id,
        status: current.status,
      },
      data: buildStatusPatch(input.toStatus, input.patch),
    });

    if (updatedCount.count !== 1) {
      throw new Error(`payment transition conflict: ${input.paymentIntentId}`);
    }

    await tx.paymentEvent.create({
      data: {
        paymentIntentId: current.id,
        type: input.eventType,
        fromStatus: current.status,
        toStatus: input.toStatus,
        summary: input.summary,
        payload: (input.payload ?? null) as any,
      },
    });

    const updated = await tx.paymentIntent.findUnique({
      where: { id: current.id },
    });

    if (!updated) {
      throw new Error(`payment intent missing after transition: ${current.id}`);
    }

    return {
      applied: true,
      payment: updated,
    };
  });
}
