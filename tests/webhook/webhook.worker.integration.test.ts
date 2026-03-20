import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
} from "bun:test";
import { Queue, Worker } from "bullmq";

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

const { handleWebhookInboundJob } =
  await import("~/server/services/webhooks/handleWebhookInboundJob");

// ✅ FIX: ห้ามมี :
const queueName = `test_webhook_inbound_${Date.now()}`;
const dlqName = `${queueName}__dlq`;

const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

describe("webhook worker integration", () => {
  let queue: Queue;
  let dlq: Queue;
  let worker: Worker;

  beforeAll(async () => {
    queue = new Queue(queueName, { connection });
    dlq = new Queue(dlqName, { connection });

    worker = new Worker(
      queueName,
      async (job) => {
        return await handleWebhookInboundJob(job as any, dlq as any);
      },
      { connection },
    );
  });

  afterAll(async () => {
    await worker.close();
    await queue.close();
    await dlq.close();
  });

  beforeEach(async () => {
    prismaMock.webhookEvent.update.mockReset();
    processWebhookEventMock.mockReset();

    // cleanup queue ทุกครั้ง
    await queue.drain(true);
    await dlq.drain(true);
  });

  it("processes success job from real BullMQ queue", async () => {
    processWebhookEventMock.mockResolvedValue({ ok: true });

    const completed = new Promise<any>((resolve, reject) => {
      worker.once("completed", (_, result) => resolve(result));
      worker.once("failed", (_, err) => reject(err));
    });

    await queue.add(
      "provider.webhook.process",
      { webhookEventId: "wh_ok_int_1" },
      {
        attempts: 5,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    const result = await completed;

    expect(result.ok).toBe(true);
    expect(processWebhookEventMock).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(0);
  });

  it("moves final-failed job to DLQ path", async () => {
    processWebhookEventMock.mockRejectedValue(new Error("permanent failure"));
    prismaMock.webhookEvent.update.mockResolvedValue({ id: "wh_fail_int_1" });

    const failed = new Promise<Error>((resolve) => {
      worker.once("failed", (_, err) => resolve(err));
    });

    await queue.add(
      "provider.webhook.process",
      { webhookEventId: "wh_fail_int_1" },
      {
        attempts: 1, // final attempt ทันที
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    const err = await failed;
    expect(err.message).toBe("permanent failure");

    // รอ DLQ insert
    await new Promise((r) => setTimeout(r, 200));

    const jobs = await dlq.getJobs([
      "waiting",
      "active",
      "delayed",
      "completed",
      "failed",
    ]);

    expect(jobs.length).toBe(1);
    expect(jobs[0]?.name).toBe("provider.webhook.dlq");
    expect(jobs[0]?.data.webhookEventId).toBe("wh_fail_int_1");

    expect(prismaMock.webhookEvent.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.webhookEvent.update.mock.calls[0]?.[0]?.data.status).toBe(
      "FAILED",
    );
  });
});
