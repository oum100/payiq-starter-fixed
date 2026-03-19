import { Queue } from "bullmq"
import { redis } from "./redis"

export const queueNames = {
  callback: "callback-queue",
  webhook: "webhook-queue",
  reconcile: "reconcile-queue",
  async: "async-queue",
} as const

export const callbackQueue = new Queue(queueNames.callback, { connection: redis })
export const webhookQueue = new Queue(queueNames.webhook, { connection: redis })
export const reconcileQueue = new Queue(queueNames.reconcile, { connection: redis })
export const asyncQueue = new Queue(queueNames.async, { connection: redis })
