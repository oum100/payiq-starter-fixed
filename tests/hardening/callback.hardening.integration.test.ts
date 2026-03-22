import { describe, test, expect, mock, afterEach } from "bun:test"

describe("callback hardening", () => {
  afterEach(() => {
    mock.restore()
  })

  test("should skip duplicate (processedAt)", async () => {
    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        providerCallback: {
          findUnique: async () => ({
            id: "pcb_1",
            processStatus: "PROCESSED",
            processedAt: new Date(),
          }),
        },
      },
    }))

    const { processProviderCallback } = await import(
      "~/server/services/callbacks/processProviderCallback"
    )

    const result = await processProviderCallback("pcb_1")

    expect(result).toBeDefined()
    expect(result?.skipped).toBe(true)
    expect(result?.reason).toBe("already processed")
  })

  test("should skip if payment already final", async () => {
    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        providerCallback: {
          findUnique: async () => ({
            id: "pcb_2",
            processStatus: "PENDING",
            processedAt: null,
            signatureValid: true,
            paymentIntentId: null,
            providerReference: "ref_1",
            providerTxnId: null,
            body: {
              _normalized: {
                providerReference: "ref_1",
                normalizedStatus: "SUCCEEDED",
              },
            },
          }),
          update: async () => ({}),
        },
        paymentIntent: {
          findFirst: async () => ({
            id: "pi_1",
            status: "SUCCEEDED",
          }),
        },
      },
    }))

    const { processProviderCallback } = await import(
      "~/server/services/callbacks/processProviderCallback"
    )

    const result = await processProviderCallback("pcb_2")

    expect(result).toBeDefined()
    expect(result?.skipped).toBe(true)
    expect(result?.reason).toBe("payment already final")
  })

  test("should process normally", async () => {
    let webhookCalled = false

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        providerCallback: {
          findUnique: async () => ({
            id: "pcb_3",
            processStatus: "PENDING",
            processedAt: null,
            signatureValid: true,
            paymentIntentId: null,
            providerReference: "ref_1",
            providerTxnId: null,
            body: {
              _normalized: {
                providerReference: "ref_1",
                normalizedStatus: "SUCCEEDED",
              },
            },
          }),
          update: async () => ({}),
        },
        paymentIntent: {
          findFirst: async () => ({
            id: "pi_1",
            status: "AWAITING_CUSTOMER",
            providerReference: null,
            providerTransactionId: null,
          }),
        },
      },
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: async () => ({
        applied: true,
        payment: { id: "pi_1", status: "SUCCEEDED" },
      }),
    }))

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: async () => {
        webhookCalled = true
      },
    }))

    const { processProviderCallback } = await import(
      "~/server/services/callbacks/processProviderCallback"
    )

    const result = await processProviderCallback("pcb_3")

    expect(result).toBeDefined()
    expect(result?.ok).toBe(true)
    expect(webhookCalled).toBe(true)
  })
})