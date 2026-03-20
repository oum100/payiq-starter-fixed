import { beforeEach, describe, expect, it, mock } from "bun:test";

const prismaMock = {
  paymentIntent: {
    findUnique: mock(),
  },
  reconciliationRecord: {
    create: mock(),
    update: mock(),
  },
};

const providerAdapterMock = {
  inquirePayment: mock(),
};

const getProviderAdapterMock = mock(() => providerAdapterMock);
const applyPaymentTransitionMock = mock();
const enqueueWebhookForPaymentMock = mock();

mock.module("~/server/lib/prisma", () => ({
  prisma: prismaMock,
}));

mock.module("~/server/services/providers/registry", () => ({
  getProviderAdapter: getProviderAdapterMock,
}));

mock.module("~/server/services/payments/stateMachine", () => ({
  applyPaymentTransition: applyPaymentTransitionMock,
}));

mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
  enqueueWebhookForPayment: enqueueWebhookForPaymentMock,
}));

const { reconcilePayment } = await import(
  "~/server/services/reconcile/reconcilePayment"
);

describe("reconcilePayment", () => {
  beforeEach(() => {
    prismaMock.paymentIntent.findUnique.mockReset();
    prismaMock.reconciliationRecord.create.mockReset();
    prismaMock.reconciliationRecord.update.mockReset();
    providerAdapterMock.inquirePayment.mockReset();
    getProviderAdapterMock.mockClear();
    applyPaymentTransitionMock.mockReset();
    enqueueWebhookForPaymentMock.mockReset();
  });

  it("skips when payment is not reconcilable", async () => {
    prismaMock.paymentIntent.findUnique.mockResolvedValue(null);

    const result = await reconcilePayment("pi_missing");

    expect(result).toEqual({
      ok: true,
      skipped: true,
      reason: "payment not reconcilable",
    });
  });

  it("corrects payment to SUCCEEDED when inquiry succeeds", async () => {
    prismaMock.paymentIntent.findUnique.mockResolvedValue({
      id: "pi_1",
      status: "FAILED",
      providerCode: "SCB",
      providerReference: "ref_1",
      providerTransactionId: "txn_1",
      billerProfile: {
        id: "bp_1",
        providerCode: "SCB",
        billerId: "123",
        credentialsEncrypted: {},
        config: {},
      },
    });

    providerAdapterMock.inquirePayment.mockResolvedValue({
      status: "SUCCEEDED",
      providerReference: "ref_1",
      providerTransactionId: "txn_1",
      rawResponse: { ok: true },
    });

    prismaMock.reconciliationRecord.create.mockResolvedValue({
      id: "rec_1",
    });

    applyPaymentTransitionMock.mockResolvedValue({
      applied: true,
      payment: {
        id: "pi_1",
        status: "SUCCEEDED",
      },
    });

    prismaMock.reconciliationRecord.update.mockResolvedValue({
      id: "rec_1",
    });
    enqueueWebhookForPaymentMock.mockResolvedValue(undefined);

    const result = await reconcilePayment("pi_1");

    expect(applyPaymentTransitionMock).toHaveBeenCalledTimes(1);
    expect(enqueueWebhookForPaymentMock).toHaveBeenCalledWith(
      "pi_1",
      "PAYMENT_SUCCEEDED",
    );
    expect(prismaMock.reconciliationRecord.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: true,
      corrected: true,
      status: "SUCCEEDED",
    });
  });

  it("records mismatch when provider reports FAILED", async () => {
    prismaMock.paymentIntent.findUnique.mockResolvedValue({
      id: "pi_2",
      status: "PROCESSING",
      providerCode: "SCB",
      providerReference: "ref_2",
      providerTransactionId: "txn_2",
      billerProfile: {
        id: "bp_2",
        providerCode: "SCB",
        billerId: "123",
        credentialsEncrypted: {},
        config: {},
      },
    });

    providerAdapterMock.inquirePayment.mockResolvedValue({
      status: "FAILED",
      providerReference: "ref_2",
      providerTransactionId: "txn_2",
      rawResponse: { ok: false },
    });

    prismaMock.reconciliationRecord.create.mockResolvedValue({
      id: "rec_2",
    });

    prismaMock.reconciliationRecord.update.mockResolvedValue({
      id: "rec_2",
    });

    const result = await reconcilePayment("pi_2");

    expect(applyPaymentTransitionMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      ok: true,
      corrected: false,
      status: "PROCESSING",
      reason: "provider reported failed",
    });
  });
});