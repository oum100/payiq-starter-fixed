import { beforeEach, describe, expect, it, mock } from "bun:test";

const defineEventHandlerMock = (fn: any) => fn;

mock.module("h3", () => ({
  defineEventHandler: defineEventHandlerMock,
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

const handler = (await import("~/server/api/internal/queues/health.get")).default;

describe("GET /api/internal/queues/health", () => {
  beforeEach(() => {
    for (const value of Object.values(mockedQueues)) {
      value.getJobCounts.mockClear();
      value.getJobCounts.mockResolvedValue(counts);
    }
  });

  it("returns queue stats for all queues and DLQs", async () => {
    const result = await handler({} as any);

    expect(result.ok).toBe(true);
    expect(result.items).toHaveLength(8);

    expect(result.items[0]).toEqual({
      name: "payiq-webhook-inbound",
      counts,
    });

    expect(mockedQueues.webhookInboundQueue.getJobCounts).toHaveBeenCalledTimes(1);
    expect(mockedQueues.webhookInboundDlqQueue.getJobCounts).toHaveBeenCalledTimes(1);
    expect(mockedQueues.webhookDeliveryQueue.getJobCounts).toHaveBeenCalledTimes(1);
    expect(mockedQueues.webhookDeliveryDlqQueue.getJobCounts).toHaveBeenCalledTimes(1);
    expect(mockedQueues.providerCallbackQueue.getJobCounts).toHaveBeenCalledTimes(1);
    expect(mockedQueues.providerCallbackDlqQueue.getJobCounts).toHaveBeenCalledTimes(1);
    expect(mockedQueues.reconcileQueue.getJobCounts).toHaveBeenCalledTimes(1);
    expect(mockedQueues.reconcileDlqQueue.getJobCounts).toHaveBeenCalledTimes(1);
  });
});