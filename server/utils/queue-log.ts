type QueueLogInput = {
  level?: 'info' | 'warn' | 'error'
  event: string
  queue: string
  jobId?: string
  jobName?: string
  attemptsMade?: number
  data?: Record<string, unknown>
  error?: unknown
}

function normalizeError(error: unknown) {
  if (!error) return undefined

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return {
    message: String(error),
  }
}

export function queueLog(input: QueueLogInput) {
  const payload = {
    ts: new Date().toISOString(),
    level: input.level ?? 'info',
    event: input.event,
    queue: input.queue,
    jobId: input.jobId,
    jobName: input.jobName,
    attemptsMade: input.attemptsMade,
    data: input.data,
    error: normalizeError(input.error),
  }

  const line = JSON.stringify(payload)

  if (payload.level === 'error') {
    console.error(line)
    return
  }

  if (payload.level === 'warn') {
    console.warn(line)
    return
  }

  console.log(line)
}