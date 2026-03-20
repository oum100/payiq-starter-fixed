import { createError, defineEventHandler, readBody } from 'h3'
import {
  providerCallbackQueue,
  reconcileQueue,
  webhookDeliveryQueue,
  webhookInboundQueue,
} from '~/server/tasks/queues'
import { QUEUE_POLICIES } from '~/server/tasks/queue-policy'

type RetryDlqBody = {
  queue: 'webhookInbound' | 'webhookDelivery' | 'providerCallback' | 'reconcile'
  jobs?: Array<{
    originalJobId: string
    payload: unknown
  }>
}

function getTargetQueue(queue: RetryDlqBody['queue']) {
  switch (queue) {
    case 'webhookInbound':
      return {
        queue: webhookInboundQueue,
        policy: QUEUE_POLICIES.webhookInbound,
      }
    case 'webhookDelivery':
      return {
        queue: webhookDeliveryQueue,
        policy: QUEUE_POLICIES.webhookDelivery,
      }
    case 'providerCallback':
      return {
        queue: providerCallbackQueue,
        policy: QUEUE_POLICIES.providerCallback,
      }
    case 'reconcile':
      return {
        queue: reconcileQueue,
        policy: QUEUE_POLICIES.reconcile,
      }
    default:
      throw createError({
        statusCode: 400,
        statusMessage: 'Unsupported queue',
      })
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RetryDlqBody>(event)

  if (!body?.queue || !Array.isArray(body.jobs) || body.jobs.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'queue and jobs[] are required',
    })
  }

  const target = getTargetQueue(body.queue)

  const results = await Promise.all(
    body.jobs.map(async (job) => {
      const id = `${body.queue}__redrive__${job.originalJobId}__${Date.now()}`

      await target.queue.add(
        target.policy.jobName,
        job.payload,
        {
          jobId: id,
          attempts: target.policy.attempts,
          backoff: {
            type: 'exponential',
            delay: target.policy.backoffDelayMs,
          },
          removeOnComplete: target.policy.removeOnComplete,
          removeOnFail: target.policy.removeOnFail,
        },
      )

      return {
        originalJobId: job.originalJobId,
        newJobId: id,
      }
    }),
  )

  return {
    ok: true,
    queue: body.queue,
    retried: results.length,
    items: results,
  }
})