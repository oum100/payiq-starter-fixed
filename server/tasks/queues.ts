import { Queue } from 'bullmq'
import IORedis from 'ioredis'
import { QUEUE_POLICIES } from './queue-policy'

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

export const queueConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

function createQueue(name: string) {
  return new Queue(name, {
    connection: queueConnection,
  })
}

export const webhookInboundQueue = createQueue(QUEUE_POLICIES.webhookInbound.queueName)
export const webhookInboundDlqQueue = createQueue(QUEUE_POLICIES.webhookInboundDlq.queueName)

export const webhookDeliveryQueue = createQueue(QUEUE_POLICIES.webhookDelivery.queueName)
export const webhookDeliveryDlqQueue = createQueue(QUEUE_POLICIES.webhookDeliveryDlq.queueName)

export const providerCallbackQueue = createQueue(QUEUE_POLICIES.providerCallback.queueName)
export const providerCallbackDlqQueue = createQueue(QUEUE_POLICIES.providerCallbackDlq.queueName)

export const reconcileQueue = createQueue(QUEUE_POLICIES.reconcile.queueName)
export const reconcileDlqQueue = createQueue(QUEUE_POLICIES.reconcileDlq.queueName)

export const allQueues = {
  webhookInboundQueue,
  webhookInboundDlqQueue,
  webhookDeliveryQueue,
  webhookDeliveryDlqQueue,
  providerCallbackQueue,
  providerCallbackDlqQueue,
  reconcileQueue,
  reconcileDlqQueue,
}