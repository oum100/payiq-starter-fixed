import { beforeEach, describe, expect, it, mock } from "bun:test";

const prismaMock = {
  webhookEvent: {
    findUnique: mock(),
    update: mock(),
  },
  paymentIntent: {
    findFirst: mock(),
  },
};

const applyPaymentTransitionMock = mock();
const enqueueWebhookForPaymentMock = mock();

mock.module("~/server/lib/prisma", () => ({
  prisma: prismaMock,
}));

mock.module("~/server/services/payments/stateMachine", () => ({
  applyPaymentTransition: applyPaymentTransitionMock,
}));

mock.module("~/server/services/webhooks/enqueueWebhook", () => ({
  enqueueWebhookForPayment: enqueueWebhookForPaymentMock,
}));

const { processWebhookEvent } = await import(
  "~/server/services/webhooks/processWebhookEvent"
);

describe("processWebhookEvent", () => {
  beforeEach(() => {
    prismaMock.webhookEvent.findUnique.mockReset();
    prismaMock.webhookEvent.update.mockReset();
    prismaMock.paymentIntent.findFirst.mockReset();
    applyPaymentTransitionMock.mockReset();
    enqueueWebhookForPaymentMock.mockReset();
  });

  it("skips already processed webhook", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_1",
      provider: "scb",
      eventId: "evt_1",
      payload: "{}",
      status: "PROCESSED",
      processedAt: new Date(),
    });

    const result = await processWebhookEvent("wh_1");

    expect(result).toEqual({
      ok: true,
      skipped: true,
      reason: "already processed",
    });
  });

  it("marks webhook processed and updates payment on SCB success", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_2",
      provider: "scb",
      eventId: "evt_2",
      payload: JSON.stringify({
        transactionId: "txn_001",
        status: "SUCCESS",
      }),
      status: "VERIFIED",
      processedAt: null,
    });

    prismaMock.paymentIntent.findFirst.mockResolvedValue({
      id: "pi_2",
      status: "AWAITING_CUSTOMER",
      providerReference: null,
      providerTransactionId: null,
    });

    applyPaymentTransitionMock.mockResolvedValue({
      applied: true,
      payment: {
        id: "pi_2",
        status: "SUCCEEDED",
      },
    });

    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_2" });
    enqueueWebhookForPaymentMock.mockResolvedValue(undefined);

    const result = await processWebhookEvent("wh_2");

    expect(applyPaymentTransitionMock).toHaveBeenCalledTimes(1);
    expect(enqueueWebhookForPaymentMock).toHaveBeenCalledWith(
      "pi_2",
      "PAYMENT_SUCCEEDED",
    );
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    expect(result.provider).toBe("scb");
  });

  it("marks webhook processed and skips when payment not found", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_3",
      provider: "kbank",
      eventId: "evt_3",
      payload: JSON.stringify({
        transactionId: "txn_missing",
        status: "SUCCESS",
      }),
      status: "VERIFIED",
      processedAt: null,
    });

    prismaMock.paymentIntent.findFirst.mockResolvedValue(null);
    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_3" });

    const result = await processWebhookEvent("wh_3");

    expect(result).toEqual({
      ok: true,
      skipped: true,
      reason: "payment not found",
    });

    expect(prismaMock.webhookEvent.update).toHaveBeenCalledWith({
      where: { id: "wh_3" },
      data: {
        status: "PROCESSED",
        processedAt: expect.any(Date),
        processingAttempts: { increment: 1 },
        lastError: "payment not found",
      },
    });
  });

  it("fails unknown provider", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_4",
      provider: "unknown",
      eventId: "evt_4",
      payload: "{}",
      status: "VERIFIED",
      processedAt: null,
    });

    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_4" });

    await expect(processWebhookEvent("wh_4")).rejects.toThrow("unknown provider");

    expect(prismaMock.webhookEvent.update).toHaveBeenCalledWith({
      where: { id: "wh_4" },
      data: {
        status: "FAILED",
        processingAttempts: { increment: 1 },
        lastError: "unknown provider",
      },
    });
  });
});