import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";

const prismaMock = {
  merchantAccount: {
    findFirst: mock(),
  },
  paymentIntent: {
    findFirst: mock(),
    create: mock(),
  },
  providerAttempt: {
    create: mock(),
  },
};

const reserveIdempotencyMock = mock();
const completeIdempotencyMock = mock();
const releaseIdempotencyLockMock = mock();
const resolvePaymentRouteMock = mock();
const createPaymentMock = mock();
const getProviderAdapterMock = mock(() => ({
  createPayment: createPaymentMock,
}));
const applyPaymentTransitionMock = mock();

async function loadSubject() {
  mock.module("~/server/lib/prisma", () => ({
    prisma: prismaMock,
  }));

  mock.module("~/server/services/payments/stateMachine", () => ({
    applyPaymentTransition: applyPaymentTransitionMock,
  }));

  mock.module("~/server/services/routing/resolvePaymentRoute", () => ({
    resolvePaymentRoute: resolvePaymentRouteMock,
  }));

  mock.module("~/server/services/providers/registry", () => ({
    getProviderAdapter: getProviderAdapterMock,
  }));

  mock.module("~/server/services/idempotency/reserveIdempotency", () => ({
    reserveIdempotency: reserveIdempotencyMock,
    completeIdempotency: completeIdempotencyMock,
    releaseIdempotencyLock: releaseIdempotencyLockMock,
  }));

  return await import("~/server/services/payments/createPaymentIntent");
}

describe("createPaymentIntent with state machine", () => {
  beforeEach(() => {
    mock.restore();

    prismaMock.merchantAccount.findFirst.mockReset();
    prismaMock.paymentIntent.findFirst.mockReset();
    prismaMock.paymentIntent.create.mockReset();
    prismaMock.providerAttempt.create.mockReset();
    reserveIdempotencyMock.mockReset();
    completeIdempotencyMock.mockReset();
    releaseIdempotencyLockMock.mockReset();
    resolvePaymentRouteMock.mockReset();
    createPaymentMock.mockReset();
    getProviderAdapterMock.mockClear();
    applyPaymentTransitionMock.mockReset();

    prismaMock.merchantAccount.findFirst.mockResolvedValue({
      id: "ma_1",
      tenantId: "t_1",
      status: "ACTIVE",
    });
    prismaMock.paymentIntent.findFirst.mockResolvedValue(null);
    reserveIdempotencyMock.mockResolvedValue(null);
    resolvePaymentRouteMock.mockResolvedValue({
      id: "route_1",
      providerCode: "SCB",
      billerProfile: {
        id: "bp_1",
        providerCode: "SCB",
        billerId: "123",
        credentialsEncrypted: {},
        config: {},
      },
    });

    prismaMock.paymentIntent.create.mockResolvedValue({
      id: "pi_1",
      publicId: "piq_test_1",
      amount: { toString: () => "100.00" },
      currency: "THB",
      merchantOrderId: "ord_1",
      expiresAt: new Date("2026-03-21T00:15:00.000Z"),
    });
    prismaMock.providerAttempt.create.mockResolvedValue({ id: "pa_1" });
  });

  afterAll(() => {
    mock.restore();
  });

  it("transitions to AWAITING_CUSTOMER on provider success", async () => {
    const { createPaymentIntent } = await loadSubject();

    createPaymentMock.mockResolvedValue({
      success: true,
      providerReference: "ref_1",
      providerTransactionId: "txn_1",
      qrPayload: "qr_data",
      deeplinkUrl: null,
      redirectUrl: null,
      rawRequest: {},
      rawResponse: {},
    });

    applyPaymentTransitionMock
      .mockResolvedValueOnce({
        applied: true,
        payment: { id: "pi_1", status: "ROUTING" },
      })
      .mockResolvedValueOnce({
        applied: true,
        payment: { id: "pi_1", status: "PENDING_PROVIDER" },
      })
      .mockResolvedValueOnce({
        applied: true,
        payment: {
          id: "pi_1",
          publicId: "piq_test_1",
          status: "AWAITING_CUSTOMER",
          amount: { toString: () => "100.00" },
          currency: "THB",
          qrPayload: "qr_data",
          deeplinkUrl: null,
          redirectUrl: null,
          expiresAt: new Date("2026-03-21T00:15:00.000Z"),
        },
      });

    const result = await createPaymentIntent(
      { tenantId: "t_1", merchantAccountId: "ma_1" } as any,
      {
        amount: "100.00",
        paymentMethodType: "PROMPTPAY_QR",
        currency: "THB",
        merchantOrderId: "ord_1",
      } as any,
      { idempotencyKey: "idem_1" },
    );

    expect(applyPaymentTransitionMock).toHaveBeenCalledTimes(3);
    expect(result.status).toBe("AWAITING_CUSTOMER");
    expect(completeIdempotencyMock).toHaveBeenCalledTimes(1);
  });

  it("transitions to FAILED on provider rejection", async () => {
    const { createPaymentIntent } = await loadSubject();

    createPaymentMock.mockResolvedValue({
      success: false,
      errorCode: "PROVIDER_REJECTED",
      errorMessage: "provider rejected payment",
      rawRequest: {},
      rawResponse: {},
      providerReference: null,
      providerTransactionId: null,
      qrPayload: null,
      deeplinkUrl: null,
      redirectUrl: null,
    });

    applyPaymentTransitionMock
      .mockResolvedValueOnce({
        applied: true,
        payment: { id: "pi_1", status: "ROUTING" },
      })
      .mockResolvedValueOnce({
        applied: true,
        payment: { id: "pi_1", status: "PENDING_PROVIDER" },
      })
      .mockResolvedValueOnce({
        applied: true,
        payment: {
          id: "pi_1",
          publicId: "piq_test_1",
          status: "FAILED",
          amount: { toString: () => "100.00" },
          currency: "THB",
          qrPayload: null,
          deeplinkUrl: null,
          redirectUrl: null,
          expiresAt: new Date("2026-03-21T00:15:00.000Z"),
        },
      });

    const result = await createPaymentIntent(
      { tenantId: "t_1", merchantAccountId: "ma_1" } as any,
      {
        amount: "100.00",
        paymentMethodType: "PROMPTPAY_QR",
        currency: "THB",
        merchantOrderId: "ord_1",
      } as any,
      { idempotencyKey: "idem_2" },
    );

    expect(result.status).toBe("FAILED");
    expect(applyPaymentTransitionMock).toHaveBeenCalledTimes(3);
  });
});
