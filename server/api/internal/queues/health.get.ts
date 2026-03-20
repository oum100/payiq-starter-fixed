import { defineEventHandler } from "h3";
import type { JobType } from "bullmq";
import {
  providerCallbackDlqQueue,
  providerCallbackQueue,
  reconcileDlqQueue,
  reconcileQueue,
  webhookDeliveryDlqQueue,
  webhookDeliveryQueue,
  webhookInboundDlqQueue,
  webhookInboundQueue,
} from "~/server/tasks/queues";

type QueueLike = {
  name: string;
  getJobCounts: (...types: JobType[]) => Promise<Record<string, number>>;
};

async function getQueueStats(queue: QueueLike) {
  const counts = await queue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed",
    "paused",
    "prioritized",
    "waiting-children",
  );

  return {
    name: queue.name,
    counts,
  };
}

export default defineEventHandler(async () => {
  const items = await Promise.all([
    getQueueStats(webhookInboundQueue),
    getQueueStats(webhookInboundDlqQueue),
    getQueueStats(webhookDeliveryQueue),
    getQueueStats(webhookDeliveryDlqQueue),
    getQueueStats(providerCallbackQueue),
    getQueueStats(providerCallbackDlqQueue),
    getQueueStats(reconcileQueue),
    getQueueStats(reconcileDlqQueue),
  ]);

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    items,
  };
});
