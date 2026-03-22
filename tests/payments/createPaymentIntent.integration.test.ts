import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test"

type MockedModule = {
  reset: () => void
}

function makeDecimal(value: string) {
  return {
    toString() {
      return value
    },
  }
}

function createHarness(): MockedModule {
  const providerCreatePayment = mock(async () => ({
    success: true,
    providerReference: "scb-ref-001",
    providerTransactionId: "scb-txn-001",
    qrPayload: "QR_RAW_001",
    deeplinkUrl: "scbeasy://payment/001",
    redirectUrl: null,
    rawRequest: { hello: "request" },
    rawResponse: { hello: "response" },
    errorCode: null,
    errorMessage: null,
  }))

  const stateTransitions: Array<Record<string, unknown>> = []
  const providerAttempts: Array<Record<string, unknown>> = []
  const completeIdempotencyCalls: Array<Record<string, unknown>> = []

  const paymentCreated = {
    id: "pi_001",
    publicId: "piq_test_001",
    amount: makeDecimal("20.00"),
    currency: "THB",
    merchantOrderId: "ORD-001",
    expiresAt: new Date("2026-03-22T10:15:00.000Z"),
  }

  mock.module("~/server/lib/prisma", () => ({
    prisma: {
      merchantAccount: {
        findFirst: mock(async () => ({
          id: "ma_001",
          tenantId: "tenant_001",
          status: "ACTIVE",
        })),
      },
      paymentIntent: {
        findFirst: mock(async () => null),
        create: mock(async () => paymentCreated),
      },
      providerAttempt: {
        create: mock(async (args: { data: Record<string, unknown> }) => {
          providerAttempts.push(args.data)
          return { id: "pa_001" }
        }),
      },
    },
  }))

  class FakeAppError extends Error {
    code: string
    statusCode: number

    constructor(code: string, message: string, statusCode: number) {
      super(message)
      this.code = code
      this.statusCode = statusCode
    }
  }

  mock.module("~/server/lib/errors", () => ({
    AppError: FakeAppError,
  }))

  mock.module("~/server/services/routing/resolvePaymentRoute", () => ({
    resolvePaymentRoute: mock(async () => ({
      id: "route_001",
      providerCode: "SCB",
      billerProfile: {
        id: "bp_001",
        providerCode: "SCB",
        billerId: "biller_001",
        merchantIdAtProvider: "merchant_scb_001",
        credentialsEncrypted: {},
        config: {
          mode: "live",
          apiBaseUrl: "https://api-sandbox.partners.scb",
          apiKey: "key_001",
          apiSecret: "secret_001",
          billerId: "biller_001",
          merchantId: "merchant_scb_001",
        },
      },
    })),
  }))

  mock.module("~/server/services/idempotency/reserveIdempotency", () => ({
    reserveIdempotency: mock(async () => ({
      status: "RESERVED",
      responseBody: null,
    })),
    completeIdempotency: mock(async (args: Record<string, unknown>) => {
      completeIdempotencyCalls.push(args)
    }),
    releaseIdempotencyLock: mock(async () => undefined),
  }))

  mock.module("~/server/services/providers/registry", () => ({
    getProviderAdapter: mock(() => ({
      createPayment: providerCreatePayment,
      inquirePayment: mock(async () => ({
        status: "SUCCEEDED",
        providerReference: "scb-ref-001",
        providerTransactionId: "scb-txn-001",
        rawResponse: {},
      })),
    })),
  }))

  mock.module("~/server/services/payments/stateMachine", () => ({
    applyPaymentTransition: mock(async (args: Record<string, unknown>) => {
      stateTransitions.push(args)

      const toStatus = String(args.toStatus || "")
      const patch =
        args.patch && typeof args.patch === "object"
          ? (args.patch as Record<string, unknown>)
          : {}

      return {
        payment: {
          id: "pi_001",
          publicId: "piq_test_001",
          status: toStatus,
          amount: makeDecimal("20.00"),
          currency: "THB",
          qrPayload:
            typeof patch.qrPayload === "string" ? patch.qrPayload : "QR_RAW_001",
          deeplinkUrl:
            typeof patch.deeplinkUrl === "string"
              ? patch.deeplinkUrl
              : "scbeasy://payment/001",
          redirectUrl:
            patch.redirectUrl === null || typeof patch.redirectUrl === "string"
              ? patch.redirectUrl
              : null,
          expiresAt: new Date("2026-03-22T10:15:00.000Z"),
        },
      }
    }),
  }))

  return {
    reset() {
      providerCreatePayment.mockClear()
      stateTransitions.length = 0
      providerAttempts.length = 0
      completeIdempotencyCalls.length = 0
    },
  }
}

describe("createPaymentIntent integration", () => {
  let previousAppBaseUrl: string | undefined

  beforeEach(() => {
    previousAppBaseUrl = process.env.APP_BASE_URL
    process.env.APP_BASE_URL = "https://payiq.example.com"
  })

  afterEach(() => {
    mock.restore()

    if (previousAppBaseUrl === undefined) {
      delete process.env.APP_BASE_URL
    } else {
      process.env.APP_BASE_URL = previousAppBaseUrl
    }
  })

  test("creates payment, calls provider, stores providerAttempt, and returns awaiting_customer response", async () => {
    createHarness()

    const { createPaymentIntent } = await import(
      "~/server/services/payments/createPaymentIntent"
    )

    const result = await createPaymentIntent(
      {
        tenantId: "tenant_001",
        merchantAccountId: "ma_001",
      } as never,
      {
        merchantOrderId: "ORD-001",
        merchantReference: "sess_001",
        amount: "20.00",
        currency: "THB",
        paymentMethodType: "PROMPTPAY_QR",
        customerName: "Tuu",
      } as never,
      {
        idempotencyKey: "idem_001",
      },
    )

    expect(result.publicId).toBe("piq_test_001")
    expect(result.status).toBe("AWAITING_CUSTOMER")
    expect(result.amount).toBe("20.00")
    expect(result.qrPayload).toBe("QR_RAW_001")
    expect(result.deeplinkUrl).toBe("scbeasy://payment/001")
  })

  test("provider create receives merchantReference and provider callback url", async () => {
    const receivedCalls: Array<Record<string, unknown>> = []

    const providerCreatePayment = mock(async (args: Record<string, unknown>) => {
      receivedCalls.push(args)

      return {
        success: true,
        providerReference: "scb-ref-002",
        providerTransactionId: "scb-txn-002",
        qrPayload: "QR_RAW_002",
        deeplinkUrl: "scbeasy://payment/002",
        redirectUrl: null,
        rawRequest: {},
        rawResponse: {},
        errorCode: null,
        errorMessage: null,
      }
    })

    mock.module("~/server/lib/prisma", () => ({
      prisma: {
        merchantAccount: {
          findFirst: mock(async () => ({
            id: "ma_001",
            tenantId: "tenant_001",
            status: "ACTIVE",
          })),
        },
        paymentIntent: {
          findFirst: mock(async () => null),
          create: mock(async () => ({
            id: "pi_001",
            publicId: "piq_test_001",
            amount: makeDecimal("20.00"),
            currency: "THB",
            merchantOrderId: "ORD-002",
            expiresAt: new Date("2026-03-22T10:15:00.000Z"),
          })),
        },
        providerAttempt: {
          create: mock(async () => ({ id: "pa_001" })),
        },
      },
    }))

    class FakeAppError extends Error {
      code: string
      statusCode: number

      constructor(code: string, message: string, statusCode: number) {
        super(message)
        this.code = code
        this.statusCode = statusCode
      }
    }

    mock.module("~/server/lib/errors", () => ({
      AppError: FakeAppError,
    }))

    mock.module("~/server/services/routing/resolvePaymentRoute", () => ({
      resolvePaymentRoute: mock(async () => ({
        id: "route_001",
        providerCode: "SCB",
        billerProfile: {
          id: "bp_001",
          providerCode: "SCB",
          billerId: "biller_001",
          merchantIdAtProvider: "merchant_scb_001",
          credentialsEncrypted: {},
          config: {
            mode: "live",
            apiBaseUrl: "https://api-sandbox.partners.scb",
            apiKey: "key_001",
            apiSecret: "secret_001",
            billerId: "biller_001",
            merchantId: "merchant_scb_001",
          },
        },
      })),
    }))

    mock.module("~/server/services/idempotency/reserveIdempotency", () => ({
      reserveIdempotency: mock(async () => ({
        status: "RESERVED",
        responseBody: null,
      })),
      completeIdempotency: mock(async () => undefined),
      releaseIdempotencyLock: mock(async () => undefined),
    }))

    mock.module("~/server/services/providers/registry", () => ({
      getProviderAdapter: mock(() => ({
        createPayment: providerCreatePayment,
        inquirePayment: mock(async () => ({
          status: "SUCCEEDED",
          providerReference: "scb-ref-002",
          providerTransactionId: "scb-txn-002",
          rawResponse: {},
        })),
      })),
    }))

    mock.module("~/server/services/payments/stateMachine", () => ({
      applyPaymentTransition: mock(async (args: Record<string, unknown>) => ({
        payment: {
          id: "pi_001",
          publicId: "piq_test_001",
          status: String(args.toStatus || ""),
          amount: makeDecimal("20.00"),
          currency: "THB",
          qrPayload: "QR_RAW_002",
          deeplinkUrl: "scbeasy://payment/002",
          redirectUrl: null,
          expiresAt: new Date("2026-03-22T10:15:00.000Z"),
        },
      })),
    }))

    const { createPaymentIntent } = await import(
      "~/server/services/payments/createPaymentIntent"
    )

    await createPaymentIntent(
      {
        tenantId: "tenant_001",
        merchantAccountId: "ma_001",
      } as never,
      {
        merchantOrderId: "ORD-002",
        merchantReference: "sess_iot_002",
        amount: "20.00",
        currency: "THB",
        paymentMethodType: "PROMPTPAY_QR",
      } as never,
      {
        idempotencyKey: "idem_002",
      },
    )

    expect(receivedCalls).toHaveLength(1)
    expect(receivedCalls[0]?.merchantReference).toBe("sess_iot_002")
    expect(receivedCalls[0]?.callbackUrl).toBe(
      "https://payiq.example.com/api/v1/providers/scb/callback",
    )
  })
})