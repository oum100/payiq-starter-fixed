import {
  defineEventHandler,
  getRequestURL,
  setHeader,
} from "h3";
import { runWithRequestContext } from "~/server/lib/request-context";
import { getOrCreateRequestId, getOrCreateTraceId } from "~/server/lib/trace";
import { logEvent } from "~/server/lib/observability";

export default defineEventHandler(async (event) => {
  const requestId = getOrCreateRequestId(event);
  const traceId = getOrCreateTraceId(event);
  const url = getRequestURL(event);

  setHeader(event, "x-request-id", requestId);
  setHeader(event, "x-trace-id", traceId);

  return await runWithRequestContext(
    {
      requestId,
      traceId,
      method: event.method,
      path: url.pathname,
      route: event.path,
    },
    async () => {
      logEvent({
        event: "http.request.received",
        data: {
          query: Object.fromEntries(url.searchParams.entries()),
        },
      });

      try {
        const result = await Promise.resolve();

        logEvent({
          event: "http.request.context_ready",
        });

        return result;
      } catch (error) {
        logEvent({
          level: "error",
          event: "http.request.failed",
          error,
        });
        throw error;
      }
    },
  );
});