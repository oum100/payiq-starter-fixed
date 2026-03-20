import { Worker, Queue } from "bullmq";
import { redis } from "~/server/lib/redis";
import { queueNames } from "~/server/lib/bullmq";
import { processProviderCallback } from "~/server/services/callbacks/processProviderCallback";
import { deliverWebhook } from "~/server/services/webhooks/deliverWebhook";
import { reconcilePayment } from "~/server/services/reconcile/reconcilePayment";
import { handleWebhookInboundJob } from "~/server/services/webhooks/handleWebhookInboundJob";
import { logger } from "~/server/lib/logger";

new Worker(queueNames.callback, async (job) => {
  if (job.name === "provider.callback.process") {
    await processProviderCallback(job.data.providerCallbackId);
  }
}, { connection: redis, concurrency: 20 });

new Worker(queueNames.webhook, async (job) => {
  if (job.name === "merchant.webhook.deliver") {
    await deliverWebhook(job.data.webhookDeliveryId);
  }
}, { connection: redis, concurrency: 50 });

const webhookDlq = new Queue(`${queueNames.webhookInbound}:dlq`, {
  connection: redis,
});

new Worker(queueNames.webhookInbound, async (job) => {
  if (job.name !== "provider.webhook.process") return;
  await handleWebhookInboundJob(job, webhookDlq);
}, { connection: redis, concurrency: 20 });

new Worker(queueNames.reconcile, async (job) => {
  if (job.name === "payment.reconcile.single") {
    await reconcilePayment(job.data.paymentIntentId);
  }
}, { connection: redis, concurrency: 10 });

logger.info("Workers started");