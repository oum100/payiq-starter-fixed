import { prisma } from "~/server/lib/prisma";
import { processWebhookEvent } from "~/server/services/webhooks/processWebhookEvent";
import { NonRetryableJobError } from "~/server/tasks/job-errors";

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
  add: (
    name: string,
    data: Record<string, any>,
    opts?: Record<string, any>,
  ) => Promise<any>;
};

function toSafeDlqJobId(webhookEventId: string) {
  return `dlq__webhook__${webhookEventId}`;
}

export async function handleWebhookInboundJob(
  job: WebhookInboundJob,
  dlq?: DlqLike,
) {
  const webhookEventId = job.data?.webhookEventId;

  if (!webhookEventId) {
    throw new NonRetryableJobError(
      "Missing webhookEventId in job payload",
      "MISSING_WEBHOOK_EVENT_ID",
    );
  }

  const existing = await prisma.webhookEvent.findUnique({
    where: { id: webhookEventId },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new NonRetryableJobError(
      `Webhook event not found: ${webhookEventId}`,
      "WEBHOOK_EVENT_NOT_FOUND",
    );
  }

  try {
    return await processWebhookEvent(webhookEventId);
  } catch (error: any) {
    const attempts = job.attemptsMade + 1;
    const maxAttempts = job.opts?.attempts ?? 1;
    const isFinalAttempt = attempts >= maxAttempts;
    const message = error?.message || "unknown error";

    await prisma.webhookEvent.update({
      where: { id: webhookEventId },
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
          webhookEventId,
          failedAt: new Date().toISOString(),
          reason: message,
        },
        {
          jobId: toSafeDlqJobId(webhookEventId),
          removeOnComplete: 1000,
          removeOnFail: 1000,
        },
      );
    }

    throw error;
  }
}
