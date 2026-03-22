import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

function makeDecimal(value: string) {
  return {
    toString() {
      return value;
    },
  };
}

type PaymentRecord = {
  id: string;
  publicId: string;
  tenantId: string;
  merchantAccountId: string;
  paymentRouteId: string;
  billerProfileId: string;
  merchantOrderId: string | null;
  merchantReference: string | null;
  providerCode: string;
  providerReference: string | null;
  providerTransactionId: string | null;
  currency: string;
  amount: { toString(): string };
  status: string;
  qrPayload: string | null;
  deeplinkUrl: string | null;
  redirectUrl: string | null;
  expiresAt: Date | null;
  succeededAt: Date | null;
  failedAt: Date | null;
  expiredAt: Date | null;
};

type ProviderCallbackRecord = {
  id: string;
  paymentIntentId: string | null;
  processStatus: string;
  signatureValid: boolean | null;
  providerReference: string | null;
  providerTxnId: string | null;
  body: unknown;
  errorMessage: string | null;
  processedAt: Date | null;
  failedAt: Date | null;
};

describe("SCB full flow e2e-lite", () => {
  const originalAppBaseUrl = process.env.APP_BASE_URL;
  const originalScbCallbackSecret = process.env.SCB_CALLBACK_SECRET;

  let paymentRecord: PaymentRecord;
  let providerCallbackRecord: ProviderCallbackRecord | null;
  let paymentExists = false;

  beforeEach(() => {
    process.env.APP_BASE_URL = "https://payiq.example.com";
    process.env.SCB_CALLBACK_SECRET = "secret_scb_test";

    paymentExists = false;

    paymentRecord = {
      id: "pi_001",
      publicId: "piq_test_001",
      tenantId: "tenant_001",
      merchantAccountId: "ma_001",
      paymentRouteId: "route_001",
      billerProfileId: "bp_001",
      merchantOrderId: null,
      merchantReference: null,
      providerCode: "SCB",
      providerReference: null,
      providerTransactionId: null,
      currency: "THB",
      amount: makeDecimal("20.00"),
      status: "CREATED",
      qrPayload: null,
      deeplinkUrl: null,
      redirectUrl: null,
      expiresAt: new Date("2026-03-22T18:15:00.000Z"),
      succeededAt: null,
      failedAt: null,
      expiredAt: null,
    };

    providerCallbackRecord = null;
    (globalThis as Record<string, unknown>).defineEventHandler = (
      fn: unknown,
    ) => fn;
    (globalThis as Record<string, unknown>).readRawBody = async (event: {
      rawBody?: string;
    }) => event.rawBody || "";
    (globalThis as Record<string, unknown>).getHeaders = (event: {
      headers?: Record<string, string>;
    }) => event.headers || {};
    (globalThis as Record<string, unknown>).getQuery = (event: {
      query?: Record<string, string>;
    }) => event.query || {};
    (globalThis as Record<string, unknown>).getHeader = (
      event: { headers?: Record<string, string> },
      name: string,
    ) => {
      const headers = event.headers || {};
      return (
        headers[name] ??
        headers[name.toLowerCase()] ??
        headers[name.toUpperCase()]
      );
    };
  });

  afterEach(() => {
    mock.restore();

    delete (globalThis as Record<string, unknown>).defineEventHandler;
    delete (globalThis as Record<string, unknown>).readRawBody;
    delete (globalThis as Record<string, unknown>).getHeaders;
    delete (globalThis as Record<string, unknown>).getQuery;
    delete (globalThis as Record<string, unknown>).getHeader;

    if (originalAppBaseUrl === undefined) {
      delete process.env.APP_BASE_URL;
    } else {
      process.env.APP_BASE_URL = originalAppBaseUrl;
    }

    if (originalScbCallbackSecret === undefined) {
      delete process.env.SCB_CALLBACK_SECRET;
    } else {
      process.env.SCB_CALLBACK_SECRET = originalScbCallbackSecret;
    }
  });

  test("create payment -> callback ingress -> callback process -> payment succeeded", async () => {
    const providerAttempts: Array<Record<string, unknown>> = [];
    const queueJobs: Array<Record<string, unknown>> = [];
    const webhookJobs: Array<Record<string, unknown>> = [];

    const matchPaymentFromWhere = (
      where?: Record<string, unknown>,
    ): PaymentRecord | null => {
      if (!paymentExists || !where || typeof where !== "object") {
        return null;
      }

      const merchantOrderId = where.merchantOrderId;
      if (
        typeof merchantOrderId === "string" &&
        merchantOrderId === paymentRecord.merchantOrderId
      ) {
        return paymentRecord;
      }

      const orList = Array.isArray(where.OR)
        ? (where.OR as Array<Record<string, unknown>>)
        : [];

      for (const condition of orList) {
        if (
          typeof condition.providerTransactionId === "string" &&
          condition.providerTransactionId ===
            paymentRecord.providerTransactionId
        ) {
          return paymentRecord;
        }

        if (
          typeof condition.publicId === "string" &&
          condition.publicId === paymentRecord.publicId
        ) {
          return paymentRecord;
        }

        if (
          typeof condition.providerReference === "string" &&
          condition.providerReference === paymentRecord.providerReference
        ) {
          return paymentRecord;
        }
      }

      return null;
    };

    const applyPaymentPatch = (patch: Record<string, unknown>) => {
      paymentRecord = {
        ...paymentRecord,
        status:
          typeof patch.status === "string"
            ? patch.status
            : paymentRecord.status,
        providerReference:
          "providerReference" in patch
            ? ((patch.providerReference as string | null | undefined) ?? null)
            : paymentRecord.providerReference,
        providerTransactionId:
          "providerTransactionId" in patch
            ? ((patch.providerTransactionId as string | null | undefined) ??
              null)
            : paymentRecord.providerTransactionId,
        qrPayload:
          "qrPayload" in patch
            ? ((patch.qrPayload as string | null | undefined) ?? null)
            : paymentRecord.qrPayload,
        deeplinkUrl:
          "deeplinkUrl" in patch
            ? ((patch.deeplinkUrl as string | null | undefined) ?? null)
            : paymentRecord.deeplinkUrl,
        redirectUrl:
          "redirectUrl" in patch
            ? ((patch.redirectUrl as string | null | undefined) ?? null)
            : paymentRecord.redirectUrl,
        succeededAt:
          "succeededAt" in patch
            ? ((patch.succeededAt as Date | null | undefined) ?? null)
            : paymentRecord.succeededAt,
        failedAt:
          "failedAt" in patch
            ? ((patch.failedAt as Date | null | undefined) ?? null)
            : paymentRecord.failedAt,
        expiredAt:
          "expiredAt" in patch
            ? ((patch.expiredAt as Date | null | undefined) ?? null)
            : paymentRecord.expiredAt,
      };
    };

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
          findFirst: mock(
            async (args?: { where?: Record<string, unknown> }) => {
              return matchPaymentFromWhere(args?.where);
            },
          ),

          create: mock(async (args: { data: Record<string, unknown> }) => {
            paymentExists = true;

            paymentRecord = {
              ...paymentRecord,
              tenantId: String(args.data.tenantId),
              merchantAccountId: String(args.data.merchantAccountId),
              paymentRouteId: String(args.data.paymentRouteId),
              billerProfileId: String(args.data.billerProfileId),
              merchantOrderId:
                typeof args.data.merchantOrderId === "string"
                  ? args.data.merchantOrderId
                  : null,
              merchantReference:
                typeof args.data.merchantReference === "string"
                  ? args.data.merchantReference
                  : null,
              providerCode: String(args.data.providerCode),
              currency: String(args.data.currency),
              amount: makeDecimal(String(args.data.amount)),
              status: String(args.data.status),
              qrPayload: null,
              deeplinkUrl: null,
              redirectUrl: null,
              expiresAt:
                args.data.expiresAt instanceof Date
                  ? args.data.expiresAt
                  : null,
              providerReference: null,
              providerTransactionId: null,
              succeededAt: null,
              failedAt: null,
              expiredAt: null,
            };

            return {
              id: paymentRecord.id,
              publicId: paymentRecord.publicId,
              amount: paymentRecord.amount,
              currency: paymentRecord.currency,
              merchantOrderId: paymentRecord.merchantOrderId,
              expiresAt: paymentRecord.expiresAt,
            };
          }),

          findUnique: mock(async () => (paymentExists ? paymentRecord : null)),

          updateMany: mock(async (args: { data: Record<string, unknown> }) => {
            applyPaymentPatch(args.data);
            return { count: 1 };
          }),
        },

        paymentEvent: {
          create: mock(async () => ({ id: "pe_001" })),
        },

        providerAttempt: {
          create: mock(async (args: { data: Record<string, unknown> }) => {
            providerAttempts.push(args.data);
            return { id: "pa_001" };
          }),
        },

        providerCallback: {
          create: mock(async (args: { data: Record<string, unknown> }) => {
            providerCallbackRecord = {
              id: "pcb_001",
              paymentIntentId: null,
              processStatus: String(args.data.processStatus),
              signatureValid:
                typeof args.data.signatureValid === "boolean"
                  ? args.data.signatureValid
                  : null,
              providerReference:
                typeof args.data.providerReference === "string"
                  ? args.data.providerReference
                  : null,
              providerTxnId:
                typeof args.data.providerTxnId === "string"
                  ? args.data.providerTxnId
                  : null,
              body: args.data.body,
              errorMessage: null,
              processedAt: null,
              failedAt: null,
            };

            return { id: "pcb_001" };
          }),

          update: mock(async (args: { data: Record<string, unknown> }) => {
            if (!providerCallbackRecord) {
              throw new Error("providerCallbackRecord missing");
            }

            providerCallbackRecord = {
              ...providerCallbackRecord,
              paymentIntentId:
                "paymentIntentId" in args.data
                  ? ((args.data.paymentIntentId as string | null | undefined) ??
                    null)
                  : providerCallbackRecord.paymentIntentId,
              processStatus:
                typeof args.data.processStatus === "string"
                  ? args.data.processStatus
                  : providerCallbackRecord.processStatus,
              errorMessage:
                "errorMessage" in args.data
                  ? ((args.data.errorMessage as string | null | undefined) ??
                    null)
                  : providerCallbackRecord.errorMessage,
              processedAt:
                "processedAt" in args.data
                  ? ((args.data.processedAt as Date | null | undefined) ?? null)
                  : providerCallbackRecord.processedAt,
              failedAt:
                "failedAt" in args.data
                  ? ((args.data.failedAt as Date | null | undefined) ?? null)
                  : providerCallbackRecord.failedAt,
            };

            return { id: providerCallbackRecord.id };
          }),

          findUnique: mock(async () => providerCallbackRecord),
        },

        webhookEndpoint: {
          findMany: mock(async () => [
            {
              id: "we_001",
              tenantId: "tenant_001",
              status: "ACTIVE",
            },
          ]),
        },

        webhookDelivery: {
          create: mock(async () => ({ id: "wd_001" })),
        },

        $transaction: async <T>(
          fn: (tx: {
            paymentIntent: {
              findUnique: (args: unknown) => Promise<PaymentRecord | null>;
              updateMany: (args: unknown) => Promise<{ count: number }>;
            };
            paymentEvent: {
              create: (args: unknown) => Promise<{ id: string }>;
            };
          }) => Promise<T>,
        ) => {
          return fn({
            paymentIntent: {
              findUnique: async () => (paymentExists ? paymentRecord : null),
              updateMany: async (args: unknown) => {
                const typedArgs = args as { data: Record<string, unknown> };
                applyPaymentPatch(typedArgs.data);
                return { count: 1 };
              },
            },
            paymentEvent: {
              create: async () => ({ id: "pe_001" }),
            },
          });
        },
      },
    }));

    class FakeAppError extends Error {
      code: string;
      statusCode: number;

      constructor(code: string, message: string, statusCode: number) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
      }
    }

    mock.module("~/server/lib/errors", () => ({
      AppError: FakeAppError,
    }));

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
    }));

    mock.module("~/server/services/idempotency/reserveIdempotency", () => ({
      reserveIdempotency: mock(async () => ({
        status: "RESERVED",
        responseBody: null,
      })),
      completeIdempotency: mock(async () => undefined),
      releaseIdempotencyLock: mock(async () => undefined),
    }));

    mock.module("~/server/services/providers/registry", () => ({
      getProviderAdapter: mock(() => ({
        createPayment: mock(async () => ({
          success: true,
          providerReference: "scb-ref-001",
          providerTransactionId: "scb-txn-001",
          qrPayload: "QR_RAW_001",
          deeplinkUrl: "scbeasy://payment/001",
          redirectUrl: null,
          rawRequest: { request: true },
          rawResponse: { response: true },
          errorCode: null,
          errorMessage: null,
        })),
        inquirePayment: mock(async () => ({
          status: "SUCCEEDED",
          providerReference: "scb-ref-001",
          providerTransactionId: "scb-txn-001",
          rawResponse: {},
        })),
      })),
    }));

    mock.module("~/server/lib/bullmq", () => ({
      callbackQueue: {
        add: mock(async (_name: string, data: Record<string, unknown>) => {
          queueJobs.push(data);
          return { id: "job_001" };
        }),
      },
      webhookQueue: {
        add: mock(async (_name: string, data: Record<string, unknown>) => {
          webhookJobs.push(data);
          return { id: "wh_job_001" };
        }),
      },
    }));

    mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
      enqueueWebhookForPayment: mock(
        async (paymentIntentId: string, eventType: string) => {
          webhookJobs.push({ paymentIntentId, eventType });
        },
      ),
    }));

    mock.module("~/server/lib/crypto", () => ({
      sha256: (value: string) => `sha256:${value}`,
      hmacSha256: (secret: string, rawBody: string) => `${secret}:${rawBody}`,
      safeCompare: (a: string, b: string) => a === b,
    }));

    const { createPaymentIntent } =
      await import("~/server/services/payments/createPaymentIntent");
    const callbackRoute = (
      await import("~/server/api/v1/providers/scb/callback.post")
    ).default as (
      event: unknown,
    ) => Promise<{ received: boolean; duplicate: boolean }>;
    const { processProviderCallback } =
      await import("~/server/services/callbacks/processProviderCallback");

    const created = await createPaymentIntent(
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
      } as never,
      {
        idempotencyKey: "idem_001",
      },
    );

    expect(created.status).toBe("AWAITING_CUSTOMER");
    expect(created.qrPayload).toBe("QR_RAW_001");
    expect(providerAttempts).toHaveLength(1);

    const rawCallbackBody = JSON.stringify({
      partnerPaymentId: paymentRecord.publicId,
      transactionId: "scb-txn-001",
      status: "SUCCESS",
    });

    const response = await callbackRoute({
      method: "POST",
      path: "/api/v1/providers/scb/callback",
      headers: {
        "x-signature": `secret_scb_test:${rawCallbackBody}`,
      },
      rawBody: rawCallbackBody,
    } as never);

    expect(response).toEqual({
      received: true,
      duplicate: false,
    });

    expect(providerCallbackRecord).not.toBeNull();
    expect(providerCallbackRecord?.processStatus).toBe("QUEUED");
    expect(queueJobs).toHaveLength(1);
    expect(queueJobs[0]?.providerCallbackId).toBe("pcb_001");

    await processProviderCallback("pcb_001");

    expect(paymentRecord.status).toBe("SUCCEEDED");
    expect(paymentRecord.providerTransactionId).toBe("scb-txn-001");
    expect(paymentRecord.providerReference).toBe(paymentRecord.publicId);

    expect(providerCallbackRecord).not.toBeNull();
    expect(providerCallbackRecord?.processStatus).toBe("PROCESSED");
    expect(providerCallbackRecord?.paymentIntentId).toBe(paymentRecord.id);

    expect(webhookJobs).toEqual(
      expect.arrayContaining([
        { paymentIntentId: "pi_001", eventType: "PAYMENT_SUCCEEDED" },
      ]),
    );
  });
});
