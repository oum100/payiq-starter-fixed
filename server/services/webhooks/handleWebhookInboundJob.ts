import { prisma } from "~/server/lib/prisma";
import { processWebhookEvent } from "~/server/services/webhooks/processWebhookEvent";

type WebhookInboundJob = {
  data: {
    webhookEventId: string;
  };
  attemptsMade: number;
  opts?: {
    attempts?: number;
  };
};

type DlqLike = {
  add: (name: string, data: Record<string, any>, opts?: Record<string, any>) => Promise<any>;
};

function toSafeDlqJobId(webhookEventId: string) {
  return `dlq__webhook__${webhookEventId}`;
}

export async function handleWebhookInboundJob(
  job: WebhookInboundJob,
  dlq?: DlqLike,
) {
  try {
    return await processWebhookEvent(job.data.webhookEventId);
  } catch (error: any) {
    const attempts = job.attemptsMade + 1;
    const maxAttempts = job.opts?.attempts ?? 1;
    const isFinalAttempt = attempts >= maxAttempts;
    const message = error?.message || "unknown error";

    await prisma.webhookEvent.update({
      where: { id: job.data.webhookEventId },
      data: {
        status: isFinalAttempt ? "FAILED" : "VERIFIED",
        processingAttempts: { increment: 1 },
        lastError: message,
      },
    });

    if (isFinalAttempt && dlq) {
      await dlq.add(
        "provider.webhook.dlq",
        {
          webhookEventId: job.data.webhookEventId,
          failedAt: new Date().toISOString(),
          reason: message,
        },
        {
          jobId: toSafeDlqJobId(job.data.webhookEventId),
          removeOnComplete: 1000,
          removeOnFail: 1000,
        },
      );
    }

    throw error;
  }
}