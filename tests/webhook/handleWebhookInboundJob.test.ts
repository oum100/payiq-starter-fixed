import { beforeEach, describe, expect, it, mock } from "bun:test";

const prismaMock = {
  webhookEvent: {
    update: mock(),
  },
};

const processWebhookEventMock = mock();

mock.module("~/server/lib/prisma", () => ({
  prisma: prismaMock,
}));

mock.module("~/server/services/webhooks/processWebhookEvent", () => ({
  processWebhookEvent: processWebhookEventMock,
}));

const { handleWebhookInboundJob } = await import(
  "~/server/services/webhooks/handleWebhookInboundJob"
);

beforeEach(() => {
  prismaMock.webhookEvent.update.mockReset();
  processWebhookEventMock.mockReset();
});

describe("handleWebhookInboundJob", () => {
  it("passes through when processor succeeds", async () => {
    processWebhookEventMock.mockResolvedValue({ ok: true });

    const dlq = {
      add: mock(),
    };

    const result = await handleWebhookInboundJob(
      {
        data: { webhookEventId: "wh_ok_1" },
        attemptsMade: 0,
        opts: { attempts: 5 },
      },
      dlq,
    );

    expect(result.ok).toBe(true);
    expect(processWebhookEventMock).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(0);
    expect(dlq.add).toHaveBeenCalledTimes(0);
  });

  it("marks VERIFIED and throws for retry on non-final attempt", async () => {
    processWebhookEventMock.mockRejectedValue(new Error("temporary failure"));
    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_retry_1" });

    const dlq = {
      add: mock(),
    };

    await expect(
      handleWebhookInboundJob(
        {
          data: { webhookEventId: "wh_retry_1" },
          attemptsMade: 1,
          opts: { attempts: 5 },
        },
        dlq,
      ),
    ).rejects.toThrow("temporary failure");

    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.update.mock.calls[0]?.[0]?.data?.status).toBe("VERIFIED");
    expect(prismaMock.webhookEvent.update.mock.calls[0]?.[0]?.data?.lastError).toBe(
      "temporary failure",
    );
    expect(dlq.add).toHaveBeenCalledTimes(0);
  });

  it("marks FAILED and sends to DLQ on final attempt", async () => {
    processWebhookEventMock.mockRejectedValue(new Error("permanent failure"));
    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_fail_1" });

    const dlq = {
      add: mock().mockResolvedValue({}),
    };

    await expect(
      handleWebhookInboundJob(
        {
          data: { webhookEventId: "wh_fail_1" },
          attemptsMade: 4,
          opts: { attempts: 5 },
        },
        dlq,
      ),
    ).rejects.toThrow("permanent failure");

    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.update.mock.calls[0]?.[0]?.data?.status).toBe("FAILED");
    expect(dlq.add).toHaveBeenCalledTimes(1);
    expect(dlq.add.mock.calls[0]?.[0]).toBe("provider.webhook.dlq");
    expect(dlq.add.mock.calls[0]?.[1]?.webhookEventId).toBe("wh_fail_1");
  });

  it("uses default attempts=1 and goes DLQ immediately", async () => {
    processWebhookEventMock.mockRejectedValue(new Error("boom"));
    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_fail_2" });

    const dlq = {
      add: mock().mockResolvedValue({}),
    };

    await expect(
      handleWebhookInboundJob(
        {
          data: { webhookEventId: "wh_fail_2" },
          attemptsMade: 0,
        },
        dlq,
      ),
    ).rejects.toThrow("boom");

    expect(prismaMock.webhookEvent.update.mock.calls[0]?.[0]?.data?.status).toBe("FAILED");
    expect(dlq.add).toHaveBeenCalledTimes(1);
  });
});