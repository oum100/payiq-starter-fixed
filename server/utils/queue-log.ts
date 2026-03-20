import { logEvent } from "~/server/lib/observability";

type QueueLogInput = {
  level?: "info" | "warn" | "error";
  event: string;
  queue: string;
  jobId?: string;
  jobName?: string;
  attemptsMade?: number;
  data?: Record<string, unknown>;
  error?: unknown;
};

export function queueLog(input: QueueLogInput) {
  logEvent({
    level: input.level,
    event: input.event,
    data: {
      queue: input.queue,
      jobId: input.jobId,
      jobName: input.jobName,
      attemptsMade: input.attemptsMade,
      ...(input.data ?? {}),
    },
    error: input.error,
  });
}