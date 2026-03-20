import { randomUUID } from "node:crypto";
import type { H3Event } from "h3";
import { getHeader } from "h3";

function sanitizeId(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getOrCreateRequestId(event: H3Event) {
  return (
    sanitizeId(getHeader(event, "x-request-id")) ??
    sanitizeId(getHeader(event, "x-correlation-id")) ??
    randomUUID()
  );
}

export function getOrCreateTraceId(event: H3Event) {
  return (
    sanitizeId(getHeader(event, "x-trace-id")) ??
    sanitizeId(getHeader(event, "traceparent")) ??
    randomUUID()
  );
}