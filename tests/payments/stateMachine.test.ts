import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";

const txMock = {
  paymentIntent: {
    findUnique: mock(),
    updateMany: mock(),
  },
  paymentEvent: {
    create: mock(),
  },
};

const prismaMock = {
  $transaction: mock(async (fn: (tx: typeof txMock) => unknown) => {
    return await fn(txMock);
  }),
};

let applyPaymentTransition: any;
let canTransition: any;

async function loadFreshSubject() {
  mock.module("~/server/lib/prisma", () => ({
    prisma: prismaMock,
  }));

  // สำคัญมาก: ใช้ cache-busting import เพื่อไม่เอา stateMachine ที่ถูก mock
  // จาก test ไฟล์อื่นมาก่อนหน้านี้กลับมาใช้ซ้ำ
  const mod = await import(
    `../../server/services/payments/stateMachine.ts?fresh=${Date.now()}_${Math.random()}`
  );

  return mod;
}

describe("payment state machine", () => {
  beforeEach(async () => {
    mock.restore();

    txMock.paymentIntent.findUnique.mockReset();
    txMock.paymentIntent.updateMany.mockReset();
    txMock.paymentEvent.create.mockReset();

    prismaMock.$transaction.mockReset();
    prismaMock.$transaction.mockImplementation(
      async (fn: (tx: typeof txMock) => unknown) => {
        return await fn(txMock);
      },
    );

    const mod = await loadFreshSubject();
    applyPaymentTransition = mod.applyPaymentTransition;
    canTransition = mod.canTransition;
  });

  afterAll(() => {
    mock.restore();
  });

  it("allows valid transition AWAITING_CUSTOMER -> SUCCEEDED", async () => {
    txMock.paymentIntent.findUnique
      .mockResolvedValueOnce({
        id: "pi_1",
        status: "AWAITING_CUSTOMER",
      })
      .mockResolvedValueOnce({
        id: "pi_1",
        status: "SUCCEEDED",
      });

    txMock.paymentIntent.updateMany.mockResolvedValue({ count: 1 });
    txMock.paymentEvent.create.mockResolvedValue({ id: "evt_1" });

    const result = await applyPaymentTransition({
      paymentIntentId: "pi_1",
      toStatus: "SUCCEEDED",
      eventType: "PAYMENT_SUCCEEDED",
      summary: "ok",
    });

    expect(result.applied).toBe(true);
    expect(result.payment.status).toBe("SUCCEEDED");
    expect(txMock.paymentIntent.updateMany).toHaveBeenCalledTimes(1);
    expect(txMock.paymentEvent.create).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid transition SUCCEEDED -> FAILED", async () => {
    txMock.paymentIntent.findUnique.mockResolvedValue({
      id: "pi_2",
      status: "SUCCEEDED",
    });

    await expect(
      applyPaymentTransition({
        paymentIntentId: "pi_2",
        toStatus: "FAILED",
        eventType: "PAYMENT_FAILED",
        summary: "bad",
      }),
    ).rejects.toThrow("invalid payment transition");
  });

  it("allows reconciliation override FAILED -> SUCCEEDED when explicitly allowed", async () => {
    txMock.paymentIntent.findUnique
      .mockResolvedValueOnce({
        id: "pi_3",
        status: "FAILED",
      })
      .mockResolvedValueOnce({
        id: "pi_3",
        status: "SUCCEEDED",
      });

    txMock.paymentIntent.updateMany.mockResolvedValue({ count: 1 });
    txMock.paymentEvent.create.mockResolvedValue({ id: "evt_3" });

    const result = await applyPaymentTransition({
      paymentIntentId: "pi_3",
      toStatus: "SUCCEEDED",
      eventType: "RECONCILIATION_MATCHED",
      summary: "recovered",
      allowedFrom: ["FAILED", "PROCESSING"],
      patch: {
        lastReconciledAt: new Date("2026-03-21T00:00:00.000Z"),
      },
    });

    expect(result.applied).toBe(true);
    expect(txMock.paymentIntent.updateMany).toHaveBeenCalledTimes(1);
    expect(txMock.paymentEvent.create).toHaveBeenCalledTimes(1);
  });

  it("returns noop when status is unchanged", async () => {
    txMock.paymentIntent.findUnique.mockResolvedValue({
      id: "pi_4",
      status: "SUCCEEDED",
    });

    const result = await applyPaymentTransition({
      paymentIntentId: "pi_4",
      toStatus: "SUCCEEDED",
      eventType: "PAYMENT_SUCCEEDED",
      summary: "noop",
    });

    expect(result.applied).toBe(false);
    expect(result.reason).toBe("NOOP");
    expect(txMock.paymentIntent.updateMany).not.toHaveBeenCalled();
    expect(txMock.paymentEvent.create).not.toHaveBeenCalled();
  });

  it("canTransition reflects state rules", () => {
    expect(canTransition("PENDING_PROVIDER", "AWAITING_CUSTOMER")).toBe(true);
    expect(canTransition("SUCCEEDED", "FAILED")).toBe(false);
  });
});
