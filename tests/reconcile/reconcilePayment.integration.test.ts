import { afterEach, describe, expect, mock, test } from "bun:test"

function makePayment(status: string) {
  return {
    id: "pi_001",
    tenantId: "tenant_001",
    publicId: "piq_001",
    providerCode: "SCB",
    providerReference: "piq_001",
    providerTransactionId: "txn_001",
    status,
    billerProfile: {
      id: "bp_001",
      providerCode: "SCB",
      billerId: "biller_001",
      merchantIdAtProvider: "merchant_001",
      credentialsEncrypted: {},
      config: {
        mode: "live",
      },
    },
  }
}

describe("reconcilePayment integration", () => {
  afterEach(() => {
    mock.restore()
  })

  test("corrects payment to SUCCEEDED when provider inquiry succeeds", async () => {
    const createdRecords: Array<Record<string, unknown>> = []
    const updatedRecords: Array<Record<string, unknown>> = []
    const paymentUpdates: Array<Record<string, unknown>> = []
    const webhookCalls: Array<Record<string, unknown>> = []
    const transitionCalls: Array<Record<string, unknown>> = []

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        paymentIntent: {
          findUnique: mock(async () => makePayment("AWAITING_CUSTOMER")),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            paymentUpdates.push(args.data)
            return { id: "pi_001" }
          }),
        },
        reconciliationRecord: {
          create: mock(async (args: { data: Record<string, unknown> }) => {
            createdRecords.push(args.data)
            return { id: "rr_001" }
          }),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            updatedRecords.push(args.data)
            return { id: "rr_001" }
          }),
        },
      },
    }))

    mock.module("~/server/services/providers/registry", () => ({
      getProviderAdapter: mock(() => ({
        inquirePayment: mock(async () => ({
          status: "SUCCEEDED",
          providerReference: "piq_001",
          providerTransactionId: "txn_001",
          rawResponse: { provider: "SCB", status: "SUCCESS" },
        })),
      })),
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: mock(async (args: Record<string, unknown>) => {
        transitionCalls.push(args)
        return {
          applied: true,
          payment: {
            id: "pi_001",
            status: "SUCCEEDED",
          },
        }
      }),
    }))

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: mock(async (paymentIntentId: string, eventType: string) => {
        webhookCalls.push({ paymentIntentId, eventType })
      }),
    }))

    const { reconcilePayment } = await import(
      "~/server/services/reconcile/reconcilePayment"
    )

    const result = await reconcilePayment("pi_001")

    expect(result.ok).toBe(true)
    expect(result.corrected).toBe(true)
    expect(result.status).toBe("SUCCEEDED")
    expect(createdRecords).toHaveLength(1)
    expect(transitionCalls).toHaveLength(1)
    expect(transitionCalls[0]?.toStatus).toBe("SUCCEEDED")
    expect(webhookCalls).toEqual([
      { paymentIntentId: "pi_001", eventType: "PAYMENT_SUCCEEDED" },
    ])
    expect(updatedRecords.at(-1)?.status).toBe("CORRECTED")
  })

  test("marks pending without correcting when provider inquiry is still pending", async () => {
    const createdRecords: Array<Record<string, unknown>> = []
    const updatedRecords: Array<Record<string, unknown>> = []
    const paymentUpdates: Array<Record<string, unknown>> = []

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        paymentIntent: {
          findUnique: mock(async () => makePayment("AWAITING_CUSTOMER")),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            paymentUpdates.push(args.data)
            return { id: "pi_001" }
          }),
        },
        reconciliationRecord: {
          create: mock(async (args: { data: Record<string, unknown> }) => {
            createdRecords.push(args.data)
            return { id: "rr_002" }
          }),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            updatedRecords.push(args.data)
            return { id: "rr_002" }
          }),
        },
      },
    }))

    mock.module("~/server/services/providers/registry", () => ({
      getProviderAdapter: mock(() => ({
        inquirePayment: mock(async () => ({
          status: "PENDING",
          providerReference: "piq_001",
          providerTransactionId: "txn_001",
          rawResponse: { provider: "SCB", status: "PENDING" },
        })),
      })),
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: mock(async () => {
        throw new Error("should not transition")
      }),
    }))

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: mock(async () => undefined),
    }))

    const { reconcilePayment } = await import(
      "~/server/services/reconcile/reconcilePayment"
    )

    const result = await reconcilePayment("pi_001")

    expect(result.ok).toBe(true)
    expect(result.corrected).toBe(false)
    expect(result.reason).toBe("reconciliation pending")
    expect(createdRecords).toHaveLength(1)
    expect(updatedRecords.at(-1)?.status).toBe("PENDING")
    expect(paymentUpdates).toHaveLength(1)
  })

  test("corrects payment to EXPIRED when provider inquiry returns expired", async () => {
    const updatedRecords: Array<Record<string, unknown>> = []
    const webhookCalls: Array<Record<string, unknown>> = []
    const transitionCalls: Array<Record<string, unknown>> = []

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        paymentIntent: {
          findUnique: mock(async () => makePayment("AWAITING_CUSTOMER")),
          update: mock(async () => ({ id: "pi_001" })),
        },
        reconciliationRecord: {
          create: mock(async () => ({ id: "rr_003" })),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            updatedRecords.push(args.data)
            return { id: "rr_003" }
          }),
        },
      },
    }))

    mock.module("~/server/services/providers/registry", () => ({
      getProviderAdapter: mock(() => ({
        inquirePayment: mock(async () => ({
          status: "EXPIRED",
          providerReference: "piq_001",
          providerTransactionId: "txn_001",
          rawResponse: { provider: "SCB", status: "EXPIRED" },
        })),
      })),
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: mock(async (args: Record<string, unknown>) => {
        transitionCalls.push(args)
        return {
          applied: true,
          payment: {
            id: "pi_001",
            status: "EXPIRED",
          },
        }
      }),
    }))

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: mock(async (paymentIntentId: string, eventType: string) => {
        webhookCalls.push({ paymentIntentId, eventType })
      }),
    }))

    const { reconcilePayment } = await import(
      "~/server/services/reconcile/reconcilePayment"
    )

    const result = await reconcilePayment("pi_001")

    expect(result.ok).toBe(true)
    expect(result.corrected).toBe(true)
    expect(result.status).toBe("EXPIRED")
    expect(transitionCalls).toHaveLength(1)
    expect(transitionCalls[0]?.toStatus).toBe("EXPIRED")
    expect(webhookCalls).toEqual([
      { paymentIntentId: "pi_001", eventType: "PAYMENT_EXPIRED" },
    ])
    expect(updatedRecords.at(-1)?.status).toBe("CORRECTED")
  })

  test("marks mismatch when provider inquiry returns failed", async () => {
    const updatedRecords: Array<Record<string, unknown>> = []

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        paymentIntent: {
          findUnique: mock(async () => makePayment("AWAITING_CUSTOMER")),
          update: mock(async () => ({ id: "pi_001" })),
        },
        reconciliationRecord: {
          create: mock(async () => ({ id: "rr_004" })),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            updatedRecords.push(args.data)
            return { id: "rr_004" }
          }),
        },
      },
    }))

    mock.module("~/server/services/providers/registry", () => ({
      getProviderAdapter: mock(() => ({
        inquirePayment: mock(async () => ({
          status: "FAILED",
          providerReference: "piq_001",
          providerTransactionId: "txn_001",
          rawResponse: { provider: "SCB", status: "FAILED" },
        })),
      })),
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: mock(async () => {
        throw new Error("should not transition")
      }),
    }))

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: mock(async () => undefined),
    }))

    const { reconcilePayment } = await import(
      "~/server/services/reconcile/reconcilePayment"
    )

    const result = await reconcilePayment("pi_001")

    expect(result.ok).toBe(true)
    expect(result.corrected).toBe(false)
    expect(result.reason).toBe("provider reported failed")
    expect(updatedRecords.at(-1)?.status).toBe("MISMATCH")
  })
})