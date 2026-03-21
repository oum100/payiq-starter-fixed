import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";
import { Queue, Worker } from "bullmq";

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
        const { webhookEventId, shouldFail } = job.data as {
          webhookEventId?: string;
          shouldFail?: boolean;
        };

        if (!webhookEventId) {
          throw new Error("webhookEventId is required");
        }

        if (shouldFail) {
          await dlq.add(`${job.name}.dlq`, {
            originalJobName: job.name,
            webhookEventId,
            reason: "permanent failure",
          });
          throw new Error("permanent failure");
        }

        return { ok: true, webhookEventId };
      },
      { connection },
    );

    await worker.waitUntilReady();
    await queue.waitUntilReady();
    await dlq.waitUntilReady();
  });

  afterAll(async () => {
    await worker.close();
    await queue.close();
    await dlq.close();
  });

  beforeEach(async () => {
    await queue.drain(true);
    await dlq.drain(true);
  });

  it("processes success job from real BullMQ queue", async () => {
    const completed = new Promise<any>((resolve, reject) => {
      const onCompleted = (_job: unknown, result: unknown) => {
        worker.off("failed", onFailed);
        resolve(result);
      };

      const onFailed = (_job: unknown, err: Error) => {
        worker.off("completed", onCompleted);
        reject(err);
      };

      worker.once("completed", onCompleted);
      worker.once("failed", onFailed);
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
    expect(result.webhookEventId).toBe("wh_ok_int_1");
  });

  it("moves final-failed job to DLQ path", async () => {
    const failed = new Promise<Error>((resolve) => {
      worker.once("failed", (_job, err) => resolve(err as Error));
    });

    await queue.add(
      "provider.webhook.process",
      {
        webhookEventId: "wh_fail_int_1",
        shouldFail: true,
      },
      {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    const err = await failed;
    expect(err.message).toBe("permanent failure");

    await new Promise((r) => setTimeout(r, 200));

    const jobs = await dlq.getJobs([
      "waiting",
      "active",
      "delayed",
      "completed",
      "failed",
    ]);

    expect(jobs.length).toBe(1);
    expect(jobs[0]?.name).toContain(".dlq");
    expect(JSON.stringify(jobs[0]?.data)).toContain("wh_fail_int_1");
  });
});
