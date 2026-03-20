import { AsyncLocalStorage } from "node:async_hooks";
import type { H3Event } from "h3";

export type RequestContextStore = {
  requestId?: string;
  traceId?: string;
  method?: string;
  path?: string;
  route?: string;
  provider?: string;
  tenantId?: string;
  apiKeyPrefix?: string;
  webhookEventId?: string;
  paymentIntentId?: string;
  queue?: string;
  jobId?: string;
  jobName?: string;
};

const storage = new AsyncLocalStorage<RequestContextStore>();

export function runWithRequestContext<T>(
  store: RequestContextStore,
  fn: () => T,
): T {
  return storage.run(store, fn);
}

export function getRequestContext(): RequestContextStore {
  return storage.getStore() ?? {};
}

export function setRequestContext(
  patch: Partial<RequestContextStore>,
): RequestContextStore {
  const current = storage.getStore() ?? {};
  const next = { ...current, ...patch };

  if (storage.getStore()) {
    Object.assign(current, patch);
    return current;
  }

  return next;
}

export function setEventRequestContext(
  event: H3Event,
  patch: Partial<RequestContextStore>,
): RequestContextStore {
  const current = ((event.context as any).__requestContext ?? {}) as RequestContextStore;
  const next = { ...current, ...patch };
  (event.context as any).__requestContext = next;
  return next;
}

export function getEventRequestContext(event: H3Event): RequestContextStore {
  return (((event.context as any).__requestContext ?? {}) as RequestContextStore);
}