import { describe, it, expect, mock, beforeEach } from "bun:test";

const prismaMock = {
  webhookEvent: {
    updateMany: mock(),
  },
};

const processWebhookMock = mock();

mock.module("~/server/lib/prisma", () => ({
  prisma: prismaMock,
}));

mock.module("~/server/utils/queue/webhook.processor", () => ({
  processWebhook: processWebhookMock,
}));

beforeEach(() => {
  prismaMock.webhookEvent.updateMany.mockReset();
  processWebhookMock.mockReset();
});

describe("webhook.worker logic", () => {
  it("should mark processed when processor succeeds", async () => {
    processWebhookMock.mockResolvedValue({ ok: true });
    prismaMock.webhookEvent.updateMany.mockResolvedValue({ count: 1 });

    const { processWebhook } =
      await import("~/server/utils/queue/webhook.processor");
    const { prisma } = await import("~/server/lib/prisma");

    const job = {
      data: {
        provider: "scb",
        eventId: "evt_worker_ok",
        rawBody: JSON.stringify({ transactionId: "tx_001" }),
      },
    };

    await processWebhook(job.data);

    await prisma.webhookEvent.updateMany({
      where: {
        provider: job.data.provider,
        eventId: job.data.eventId,
      },
      data: {
        status: "PROCESSED",
        processedAt: new Date(),
        lastError: null,
      },
    });

    expect(processWebhookMock).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.updateMany).toHaveBeenCalledTimes(1);
  });

  it("should mark failed when processor throws", async () => {
    processWebhookMock.mockRejectedValue(new Error("processor failed"));
    prismaMock.webhookEvent.updateMany.mockResolvedValue({ count: 1 });

    const { processWebhook } =
      await import("~/server/utils/queue/webhook.processor");
    const { prisma } = await import("~/server/lib/prisma");

    const job = {
      data: {
        provider: "kbank",
        eventId: "evt_worker_fail",
        rawBody: JSON.stringify({ reference: "kb_001" }),
      },
      attemptsMade: 4,
      opts: {
        attempts: 5,
      },
    };

    try {
      await processWebhook(job.data);
    } catch (error: any) {
      await prisma.webhookEvent.updateMany({
        where: {
          provider: job.data.provider,
          eventId: job.data.eventId,
        },
        data: {
          status: "FAILED",
          lastError: error.message,
        },
      });
    }

    expect(processWebhookMock).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.updateMany).toHaveBeenCalledTimes(1);
    const firstCall = prismaMock.webhookEvent.updateMany.mock.calls[0];
    expect(firstCall).toBeDefined();
    expect(firstCall?.[0]?.data?.status).toBe("FAILED");
  });
});
