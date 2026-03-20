import { beforeEach, describe, expect, it, mock } from "bun:test";

const prismaMock = {
  webhookEvent: {
    findUnique: mock(),
    update: mock(),
  },
};

mock.module("~/server/lib/prisma", () => ({
  prisma: prismaMock,
}));

const { processWebhookEvent } =
  await import("~/server/services/webhooks/processWebhookEvent");

beforeEach(() => {
  prismaMock.webhookEvent.findUnique.mockReset();
  prismaMock.webhookEvent.update.mockReset();
});

describe("processWebhookEvent", () => {
  it("processes scb webhook event", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_1",
      provider: "scb",
      eventId: "evt_1",
      payload: JSON.stringify({
        transactionId: "tx_scb_1",
        eventType: "payment.success",
      }),
      status: "VERIFIED",
      processedAt: null,
    });
    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_1" });

    const result = await processWebhookEvent("wh_1");

    expect(result.ok).toBe(true);
    expect(!("skipped" in result) && result.provider).toBe("scb");
    expect(!("skipped" in result) && result.externalRef).toBe("tx_scb_1");
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(1);
  });

  it("processes kbank webhook event", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_2",
      provider: "kbank",
      eventId: "evt_2",
      payload: JSON.stringify({
        reference: "kb_ref_1",
        status: "SUCCESS",
      }),
      status: "VERIFIED",
      processedAt: null,
    });
    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_2" });

    const result = await processWebhookEvent("wh_2");

    expect(result.ok).toBe(true);
    expect(!("skipped" in result) && result.provider).toBe("kbank");
    expect(!("skipped" in result) && result.externalRef).toBe("kb_ref_1");
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(1);
  });

  it("skips already processed event", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_3",
      provider: "scb",
      eventId: "evt_3",
      payload: JSON.stringify({ transactionId: "tx_3" }),
      status: "PROCESSED",
      processedAt: new Date(),
    });

    const result = await processWebhookEvent("wh_3");

    expect(result.ok).toBe(true);
    expect("skipped" in result && result.skipped).toBe(true);
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(0);
  });

  it("fails on invalid json", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_4",
      provider: "scb",
      eventId: "evt_4",
      payload: "{bad json}",
      status: "VERIFIED",
      processedAt: null,
    });

    await expect(processWebhookEvent("wh_4")).rejects.toThrow(
      "invalid webhook payload",
    );
  });

  it("fails on unknown provider", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_5",
      provider: "unknown",
      eventId: "evt_5",
      payload: JSON.stringify({ ok: true }),
      status: "VERIFIED",
      processedAt: null,
    });
    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_5" });

    await expect(processWebhookEvent("wh_5")).rejects.toThrow(
      "unknown provider",
    );
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(1);
  });

  it("fails when event not found", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue(null);

    await expect(processWebhookEvent("wh_missing")).rejects.toThrow(
      "webhook event not found",
    );
  });
});
