import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";

const prismaMock = {
  webhookEvent: {
    findUnique: mock(),
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

const { handleWebhookInboundJob } =
  await import("~/server/services/webhooks/handleWebhookInboundJob");
const { NonRetryableJobError } = await import("~/server/tasks/job-errors");

beforeEach(() => {
  prismaMock.webhookEvent.findUnique.mockReset();
  prismaMock.webhookEvent.update.mockReset();
  processWebhookEventMock.mockReset();
});

describe("handleWebhookInboundJob", () => {
  it("throws NonRetryableJobError when webhookEventId is missing", async () => {
    const dlq = {
      add: mock(),
    };

    await expect(
      handleWebhookInboundJob(
        {
          data: {} as any,
          attemptsMade: 0,
          opts: { attempts: 5 },
        },
        dlq,
      ),
    ).rejects.toMatchObject({
      name: "NonRetryableJobError",
      code: "MISSING_WEBHOOK_EVENT_ID",
    });

    expect(prismaMock.webhookEvent.findUnique).toHaveBeenCalledTimes(0);
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(0);
    expect(processWebhookEventMock).toHaveBeenCalledTimes(0);
    expect(dlq.add).toHaveBeenCalledTimes(0);
  });

  it("throws NonRetryableJobError when webhook event does not exist", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue(null);

    const dlq = {
      add: mock(),
    };

    await expect(
      handleWebhookInboundJob(
        {
          data: { webhookEventId: "evt_missing" },
          attemptsMade: 0,
          opts: { attempts: 5 },
        },
        dlq,
      ),
    ).rejects.toMatchObject({
      name: "NonRetryableJobError",
      code: "WEBHOOK_EVENT_NOT_FOUND",
      message: "Webhook event not found: evt_missing",
    });

    expect(prismaMock.webhookEvent.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.findUnique).toHaveBeenCalledWith({
      where: { id: "evt_missing" },
      select: { id: true },
    });
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(0);
    expect(processWebhookEventMock).toHaveBeenCalledTimes(0);
    expect(dlq.add).toHaveBeenCalledTimes(0);
  });

  it("passes through when processor succeeds", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({ id: "wh_ok_1" });
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

    expect(result).toMatchObject({ ok: true });
    expect(prismaMock.webhookEvent.findUnique).toHaveBeenCalledTimes(1);
    expect(processWebhookEventMock).toHaveBeenCalledTimes(1);
    expect(processWebhookEventMock).toHaveBeenCalledWith("wh_ok_1");
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(0);
    expect(dlq.add).toHaveBeenCalledTimes(0);
  });

  it("marks VERIFIED and throws for retry on non-final attempt", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({ id: "wh_retry_1" });
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
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledWith({
      where: { id: "wh_retry_1" },
      data: {
        status: "VERIFIED",
        processingAttempts: { increment: 1 },
        lastError: "temporary failure",
      },
    });
    expect(dlq.add).toHaveBeenCalledTimes(0);
  });

  it("marks FAILED and sends to DLQ on final attempt", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({ id: "wh_fail_1" });
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
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledWith({
      where: { id: "wh_fail_1" },
      data: {
        status: "FAILED",
        processingAttempts: { increment: 1 },
        lastError: "permanent failure",
      },
    });

    expect(dlq.add).toHaveBeenCalledTimes(1);
    expect(dlq.add).toHaveBeenCalledWith(
      "provider.webhook.dlq",
      expect.objectContaining({
        webhookEventId: "wh_fail_1",
        reason: "permanent failure",
      }),
      expect.objectContaining({
        jobId: "dlq__webhook__wh_fail_1",
        removeOnComplete: 1000,
        removeOnFail: 1000,
      }),
    );
  });

  it("uses default attempts=1 and goes DLQ immediately", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({ id: "wh_fail_2" });
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

    expect(prismaMock.webhookEvent.update).toHaveBeenCalledWith({
      where: { id: "wh_fail_2" },
      data: {
        status: "FAILED",
        processingAttempts: { increment: 1 },
        lastError: "boom",
      },
    });
    expect(dlq.add).toHaveBeenCalledTimes(1);
  });

  it("preserves explicit NonRetryableJobError from downstream processor", async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_nonretryable_1",
    });
    processWebhookEventMock.mockRejectedValue(
      new NonRetryableJobError("bad payload", "BAD_WEBHOOK_PAYLOAD"),
    );
    prismaMock.webhookEvent.update.mockResolvedValue({
      id: "wh_nonretryable_1",
    });

    await expect(
      handleWebhookInboundJob({
        data: { webhookEventId: "wh_nonretryable_1" },
        attemptsMade: 0,
        opts: { attempts: 5 },
      }),
    ).rejects.toMatchObject({
      name: "NonRetryableJobError",
      code: "BAD_WEBHOOK_PAYLOAD",
      message: "bad payload",
    });

    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledWith({
      where: { id: "wh_nonretryable_1" },
      data: {
        status: "VERIFIED",
        processingAttempts: { increment: 1 },
        lastError: "bad payload",
      },
    });
  });
});

afterAll(() => {
  mock.restore();
});
