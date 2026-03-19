import { createWebhookQueue } from "./bullmq";

export type EnqueueWebhookJobInput = {
  eventId: string;
  provider: string;
  rawBody: string;
  merchantId?: string;
  headers?: Record<string, string | undefined>;
};

function toSafeJobId(input: { provider: string; eventId: string }) {
  return `webhook__${input.provider}__${input.eventId}`;
}

export async function enqueueWebhookJob(data: EnqueueWebhookJobInput) {
  const queue = createWebhookQueue();

  try {
    await queue.add("process-webhook", data, {
      jobId: toSafeJobId({
        provider: data.provider,
        eventId: data.eventId,
      }),
    });
  } finally {
    await queue.close();
  }
}