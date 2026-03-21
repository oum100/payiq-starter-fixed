import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";

const merchantFindFirstMock = mock();
const paymentIntentFindFirstMock = mock();
const reserveIdempotencyMock = mock();
const resolvePaymentRouteMock = mock();
const providerCreatePaymentMock = mock();
const paymentIntentCreateMock = mock();
const providerAttemptCreateMock = mock();
const paymentIntentUpdateMock = mock();
const completeIdempotencyMock = mock();
const releaseIdempotencyLockMock = mock();

async function loadSubject() {
  mock.module("~/server/lib/prisma", () => ({
    prisma: {
      merchantAccount: {
        findFirst: merchantFindFirstMock,
      },
      paymentIntent: {
        findFirst: paymentIntentFindFirstMock,
        create: paymentIntentCreateMock,
        update: paymentIntentUpdateMock,
      },
      providerAttempt: {
        create: providerAttemptCreateMock,
      },
    },
  }));

  mock.module("~/server/services/idempotency/reserveIdempotency", () => ({
    reserveIdempotency: reserveIdempotencyMock,
    completeIdempotency: completeIdempotencyMock,
    releaseIdempotencyLock: releaseIdempotencyLockMock,
  }));

  mock.module("~/server/services/routing/resolvePaymentRoute", () => ({
    resolvePaymentRoute: resolvePaymentRouteMock,
  }));

  mock.module("~/server/services/providers/registry", () => ({
    getProviderAdapter: () => ({
      createPayment: providerCreatePaymentMock,
    }),
  }));

  return await import("~/server/services/payments/createPaymentIntent");
}

describe("createPaymentIntent merchantOrderId scope", () => {
  beforeEach(() => {
    mock.restore();

    merchantFindFirstMock.mockReset();
    paymentIntentFindFirstMock.mockReset();
    reserveIdempotencyMock.mockReset();
    resolvePaymentRouteMock.mockReset();
    providerCreatePaymentMock.mockReset();
    paymentIntentCreateMock.mockReset();
    providerAttemptCreateMock.mockReset();
    paymentIntentUpdateMock.mockReset();
    completeIdempotencyMock.mockReset();
    releaseIdempotencyLockMock.mockReset();
  });

  afterAll(() => {
    mock.restore();
  });

  it("looks up existing merchant order within the same tenant and merchant account", async () => {
    const { createPaymentIntent } = await loadSubject();

    merchantFindFirstMock.mockResolvedValue({
      id: "merchant_1",
      tenantId: "tenant_1",
      status: "ACTIVE",
    });

    paymentIntentFindFirstMock.mockResolvedValue({
      publicId: "piq_existing",
      status: "AWAITING_CUSTOMER",
      amount: { toString: () => "20.00" },
      currency: "THB",
      qrPayload: null,
      deeplinkUrl: null,
      redirectUrl: null,
      expiresAt: null,
    });

    const result = await createPaymentIntent(
      {
        apiKeyId: "key_1",
        apiKeyPrefix: "pk_test_xxx",
        tenantId: "tenant_1",
        tenantCode: "demo",
        merchantAccountId: "merchant_1",
        merchantCode: "store-a",
        scopes: ["payments:create"],
      },
      {
        merchantOrderId: "ORD-1001",
        merchantReference: "REF-1001",
        amount: "20.00",
        currency: "THB",
        paymentMethodType: "PROMPTPAY_QR",
      },
      {
        idempotencyKey: "idem-1",
      },
    );

    expect(paymentIntentFindFirstMock).toHaveBeenCalledTimes(1);
    expect(paymentIntentFindFirstMock.mock.calls[0]?.[0]?.where).toEqual({
      tenantId: "tenant_1",
      merchantAccountId: "merchant_1",
      merchantOrderId: "ORD-1001",
    });

    expect(result.publicId).toBe("piq_existing");
  });
});
