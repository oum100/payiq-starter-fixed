import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("h3", () => ({
  defineEventHandler: (fn: any) => fn,
  readBody: async () => ({}),
  createError: (input: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  }) => {
    const err = new Error(
      input.statusMessage || input.message || "error",
    ) as Error & {
      statusCode?: number;
      statusMessage?: string;
    };
    err.statusCode = input.statusCode;
    err.statusMessage = input.statusMessage || input.message;
    return err;
  },
}));

const counts = {
  waiting: 1,
  active: 2,
  completed: 3,
  failed: 4,
  delayed: 5,
  paused: 0,
  prioritized: 0,
  "waiting-children": 0,
};

function makeQueue(name: string) {
  return {
    name,
    getJobCounts: mock().mockResolvedValue(counts),
  };
}

const mockedQueues = {
  webhookInboundQueue: makeQueue("payiq-webhook-inbound"),
  webhookInboundDlqQueue: makeQueue("payiq-webhook-inbound-dlq"),
  webhookDeliveryQueue: makeQueue("payiq-webhook"),
  webhookDeliveryDlqQueue: makeQueue("payiq-webhook-dlq"),
  providerCallbackQueue: makeQueue("payiq-callback"),
  providerCallbackDlqQueue: makeQueue("payiq-callback-dlq"),
  reconcileQueue: makeQueue("payiq-reconcile"),
  reconcileDlqQueue: makeQueue("payiq-reconcile-dlq"),
};

mock.module("~/server/tasks/queues", () => mockedQueues);

const handler = (await import("~/server/api/internal/queues/health.get"))
  .default;

describe("GET /api/internal/queues/health", () => {
  beforeEach(() => {
    for (const value of Object.values(mockedQueues)) {
      value.getJobCounts.mockClear();
      value.getJobCounts.mockResolvedValue(counts);
    }
  });

  afterAll(() => {
    mock.restore();
  });

  it("returns queue stats for all queues and DLQs", async () => {
    const result = await handler({} as any);

    expect(result.ok).toBe(true);
    expect(result.items).toHaveLength(8);
    expect(result.items[0]).toEqual({
      name: "payiq-webhook-inbound",
      counts,
    });
  });
});
