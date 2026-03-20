import { AsyncLocalStorage } from "node:async_hooks";

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