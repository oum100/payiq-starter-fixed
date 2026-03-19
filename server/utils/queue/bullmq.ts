import BullMQ from "bullmq";

const { Queue } = BullMQ;

export const webhookQueueName = "webhook-queue";
export const webhookDLQName = "webhook-dlq";

export function getBullMQConnection() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const url = new URL(redisUrl);

  const isTls = url.protocol === "rediss:";

  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    db: url.pathname ? Number(url.pathname.replace("/", "") || 0) : 0,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: isTls ? {} : undefined,
  };
}

export function createWebhookQueue() {
  return new Queue(webhookQueueName, {
    connection: getBullMQConnection(),
    defaultJobOptions: {
      attempts: Number(process.env.WEBHOOK_QUEUE_ATTEMPTS || 5),
      backoff: {
        type: "exponential",
        delay: Number(process.env.WEBHOOK_QUEUE_BACKOFF_MS || 2000),
      },
      removeOnComplete: 1000,
      removeOnFail: 1000,
    },
  });
}

export function createWebhookDLQ() {
  return new Queue(webhookDLQName, {
    connection: getBullMQConnection(),
    defaultJobOptions: {
      removeOnComplete: 1000,
      removeOnFail: 1000,
    },
  });
}