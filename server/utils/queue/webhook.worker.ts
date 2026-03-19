import BullMQ from "bullmq";
import { createWebhookDLQ, getBullMQConnection, webhookQueueName } from "./bullmq";
import { processWebhook } from "./webhook.processor";
import {prisma} from "~/server/lib/prisma";

const { Worker } = BullMQ;

const dlq = createWebhookDLQ();

function toSafeDlqJobId(input: { provider: string; eventId: string }) {
  return `dlq__${input.provider}__${input.eventId}`;
}

export const webhookWorker = new Worker(
  webhookQueueName,
  async (job) => {
    const { eventId } = job.data as {
      eventId: string;
      provider: string;
      rawBody: string;
      merchantId?: string;
    };

    try {
      await processWebhook(job.data);

      await prisma.webhookEvent.updateMany({
        where: {
          provider: job.data.provider,
          eventId,
        },
        data: {
          status: "PROCESSED",
          processedAt: new Date(),
          processingAttempts: {
            increment: 1,
          },
          lastError: null,
        },
      });
    } catch (error: any) {
      const attempts = job.attemptsMade + 1;
      const maxAttempts = job.opts.attempts ?? 1;

      await prisma.webhookEvent.updateMany({
        where: {
          provider: job.data.provider,
          eventId,
        },
        data: {
          status: attempts >= maxAttempts ? "FAILED" : "VERIFIED",
          processingAttempts: {
            increment: 1,
          },
          lastError: error?.message || "unknown error",
        },
      });

      if (attempts >= maxAttempts) {
        await dlq.add(
          "dead-webhook",
          {
            ...job.data,
            failedAt: new Date().toISOString(),
            reason: error?.message || "unknown error",
          },
          {
            jobId: toSafeDlqJobId({
              provider: job.data.provider,
              eventId,
            }),
          },
        );
      }

      throw error;
    }
  },
  {
    connection: getBullMQConnection(),
    concurrency: Number(process.env.WEBHOOK_WORKER_CONCURRENCY || 10),
  },
);

webhookWorker.on("ready", () => {
  console.log("[webhook-worker] ready");
});

webhookWorker.on("completed", (job) => {
  console.log("[webhook-worker] completed", {
    jobId: job.id,
    name: job.name,
  });
});

webhookWorker.on("failed", (job, err) => {
  console.error("[webhook-worker] failed", {
    jobId: job?.id,
    name: job?.name,
    error: err.message,
  });
});