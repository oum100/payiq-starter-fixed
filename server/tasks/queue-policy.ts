import { queueNames } from "~/server/lib/bullmq";

export type QueuePolicy = {
  queueName: string;
  jobName: string;
  attempts: number;
  backoffDelayMs: number;
  removeOnComplete: number | boolean;
  removeOnFail: number | boolean;
};

export const QUEUE_POLICIES = {
  webhookInbound: {
    queueName: queueNames.webhookInbound,
    jobName: "provider.webhook.process",
    attempts: 5,
    backoffDelayMs: 2000,
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
  webhookInboundDlq: {
    queueName: `${queueNames.webhookInbound}-dlq`,
    jobName: "provider.webhook.process.dlq",
    attempts: 1,
    backoffDelayMs: 0,
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
  webhookDelivery: {
    queueName: queueNames.webhook,
    jobName: "merchant.webhook.deliver",
    attempts: 8,
    backoffDelayMs: 3000,
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
  webhookDeliveryDlq: {
    queueName: `${queueNames.webhook}-dlq`,
    jobName: "merchant.webhook.deliver.dlq",
    attempts: 1,
    backoffDelayMs: 0,
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
  providerCallback: {
    queueName: queueNames.callback,
    jobName: "provider.callback.process",
    attempts: 5,
    backoffDelayMs: 2000,
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
  providerCallbackDlq: {
    queueName: `${queueNames.callback}-dlq`,
    jobName: "provider.callback.process.dlq",
    attempts: 1,
    backoffDelayMs: 0,
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
  reconcile: {
    queueName: queueNames.reconcile,
    jobName: "payment.reconcile.single",
    attempts: 3,
    backoffDelayMs: 5000,
    removeOnComplete: 500,
    removeOnFail: 2000,
  },
  reconcileDlq: {
    queueName: `${queueNames.reconcile}-dlq`,
    jobName: "payment.reconcile.single.dlq",
    attempts: 1,
    backoffDelayMs: 0,
    removeOnComplete: 500,
    removeOnFail: 2000,
  },
} as const satisfies Record<string, QueuePolicy>;

export type QueuePolicyKey = keyof typeof QUEUE_POLICIES;

export function getQueuePolicy(key: QueuePolicyKey) {
  return QUEUE_POLICIES[key];
}