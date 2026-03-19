import { prisma } from "~/server/lib/prisma"
export async function enqueueWebhookJob(job: {
  eventId: string;
  provider: string;
  rawBody: string;
  merchantId?: string;
}) {
  // Phase 1: simple async fire
  setImmediate(async () => {
    try {
      // TODO: provider-specific handler
      console.log("processing webhook", job.eventId);

      await prisma.webhookEvent.update({
        where: { eventId: job.eventId },
        data: { status: "PROCESSED" },
      });
    } catch (err: any) {
      await prisma.webhookEvent.update({
        where: { eventId: job.eventId },
        data: { status: "FAILED", error: err.message },
      });
    }
  });
}