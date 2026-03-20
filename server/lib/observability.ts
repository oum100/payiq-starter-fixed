import { logger } from "~/server/lib/logger";
import { getRequestContext } from "~/server/lib/request-context";

type LogLevel = "info" | "warn" | "error";

type ObservabilityLogInput = {
  level?: LogLevel;
  event: string;
  message?: string;
  data?: Record<string, unknown>;
  error?: unknown;
};

function serializeError(error: unknown) {
  if (!error) return undefined;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

export function logEvent(input: ObservabilityLogInput) {
  const ctx = getRequestContext();

  const payload = {
    ts: new Date().toISOString(),
    event: input.event,
    ...ctx,
    ...(input.data ?? {}),
    ...(input.error ? { error: serializeError(input.error) } : {}),
  };

  const level = input.level ?? "info";
  const message = input.message ?? input.event;

  if (level === "error") {
    logger.error(payload, message);
    return;
  }

  if (level === "warn") {
    logger.warn(payload, message);
    return;
  }

  logger.info(payload, message);
}