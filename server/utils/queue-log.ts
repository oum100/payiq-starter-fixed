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
  const level = input.level ?? "info";

  logEvent({
    level,
    event: input.event,
    data: {
      queue: input.queue,
      ...(input.jobId !== undefined && { jobId: input.jobId }),
      ...(input.jobName !== undefined && { jobName: input.jobName }),
      ...(input.attemptsMade !== undefined && {
        attemptsMade: input.attemptsMade,
      }),
      ...(input.data ?? {}),
    },
    ...(input.error !== undefined && { error: input.error }),
  });
}
