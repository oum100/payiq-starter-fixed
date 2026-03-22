import { afterEach, describe, expect, mock, test } from "bun:test"

function makePayment(status: string) {
  return {
    id: "pi_001",
    publicId: "piq_001",
    status,
    amount: {
      toString() {
        return "20.00"
      },
    },
    currency: "THB",
    qrPayload: "QR_RAW_001",
    deeplinkUrl: "scbeasy://payment/001",
    redirectUrl: null,
    expiresAt: new Date("2026-03-22T10:15:00.000Z"),
  }
}

describe("processProviderCallback integration", () => {
  afterEach(() => {
    mock.restore()
  })

  test("marks payment succeeded from normalized callback and enqueues merchant webhook", async () => {
    const callbackUpdates: Array<Record<string, unknown>> = []
    const transitions: Array<Record<string, unknown>> = []
    const webhookCalls: Array<Record<string, unknown>> = []

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        providerCallback: {
          findUnique: mock(async () => ({
            id: "pcb_001",
            paymentIntentId: null,
            processStatus: "QUEUED",
            signatureValid: true,
            providerReference: "piq_001",
            providerTxnId: "txn_001",
            body: {
              _normalized: {
                providerReference: "piq_001",
                providerTxnId: "txn_001",
                externalStatus: "SUCCESS",
                normalizedStatus: "SUCCEEDED",
                eventId: "evt_001",
              },
            },
          })),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            callbackUpdates.push(args.data)
            return { id: "pcb_001" }
          }),
        },
        paymentIntent: {
          findFirst: mock(async () => makePayment("AWAITING_CUSTOMER")),
        },
      },
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: mock(async (args: Record<string, unknown>) => {
        transitions.push(args)
        return {
          payment: makePayment(String(args.toStatus || "")),
        }
      }),
    }))

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: mock(async (paymentIntentId: string, event: string) => {
        webhookCalls.push({ paymentIntentId, event })
      }),
    }))

    const { processProviderCallback } = await import(
      "~/server/services/callbacks/processProviderCallback"
    )

    await processProviderCallback("pcb_001")

    expect(transitions).toHaveLength(1)
    expect(transitions[0]?.toStatus).toBe("SUCCEEDED")
    expect(transitions[0]?.eventType).toBe("PAYMENT_SUCCEEDED")

    expect(webhookCalls).toHaveLength(1)
    expect(webhookCalls[0]).toEqual({
      paymentIntentId: "pi_001",
      event: "PAYMENT_SUCCEEDED",
    })

    expect(callbackUpdates.at(-1)?.processStatus).toBe("PROCESSED")
  })

  test("marks callback failed when signature is invalid", async () => {
    const callbackUpdates: Array<Record<string, unknown>> = []

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        providerCallback: {
          findUnique: mock(async () => ({
            id: "pcb_bad_sig",
            paymentIntentId: null,
            processStatus: "QUEUED",
            signatureValid: false,
            providerReference: "piq_001",
            providerTxnId: "txn_001",
            body: {},
          })),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            callbackUpdates.push(args.data)
            return { id: "pcb_bad_sig" }
          }),
        },
        paymentIntent: {
          findFirst: mock(async () => null),
        },
      },
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: mock(async () => ({
        payment: makePayment("FAILED"),
      })),
    }))

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: mock(async () => undefined),
    }))

    const { processProviderCallback } = await import(
      "~/server/services/callbacks/processProviderCallback"
    )

    await processProviderCallback("pcb_bad_sig")

    expect(callbackUpdates).toHaveLength(1)
    expect(callbackUpdates[0]?.processStatus).toBe("FAILED")
    expect(callbackUpdates[0]?.errorMessage).toBe(
      "Invalid provider callback signature",
    )
  })

  test("marks callback failed when payment intent cannot be found", async () => {
    const callbackUpdates: Array<Record<string, unknown>> = []

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        providerCallback: {
          findUnique: mock(async () => ({
            id: "pcb_not_found",
            paymentIntentId: null,
            processStatus: "QUEUED",
            signatureValid: true,
            providerReference: "piq_unknown",
            providerTxnId: "txn_unknown",
            body: {
              _normalized: {
                providerReference: "piq_unknown",
                providerTxnId: "txn_unknown",
                externalStatus: "SUCCESS",
                normalizedStatus: "SUCCEEDED",
                eventId: "evt_unknown",
              },
            },
          })),
          update: mock(async (args: { data: Record<string, unknown> }) => {
            callbackUpdates.push(args.data)
            return { id: "pcb_not_found" }
          }),
        },
        paymentIntent: {
          findFirst: mock(async () => null),
        },
      },
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: mock(async () => ({
        payment: makePayment("FAILED"),
      })),
    }))

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: mock(async () => undefined),
    }))

    const { processProviderCallback } = await import(
      "~/server/services/callbacks/processProviderCallback"
    )

    await processProviderCallback("pcb_not_found")

    expect(callbackUpdates).toHaveLength(2)
    expect(callbackUpdates[0]?.processStatus).toBe("PROCESSING")
    expect(callbackUpdates[1]?.processStatus).toBe("FAILED")
    expect(callbackUpdates[1]?.errorMessage).toBe(
      "Payment intent not found for callback",
    )
  })
})