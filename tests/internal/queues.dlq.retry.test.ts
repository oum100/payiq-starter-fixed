import { beforeEach, describe, expect, it, mock } from "bun:test";

const readBodyMock = mock();
const createErrorMock = (input: { statusCode: number; statusMessage: string }) => {
  const error = new Error(input.statusMessage) as Error & {
    statusCode: number;
    statusMessage: string;
  };
  error.statusCode = input.statusCode;
  error.statusMessage = input.statusMessage;
  return error;
};

mock.module("h3", () => ({
  defineEventHandler: (fn: any) => fn,
  readBody: readBodyMock,
  createError: createErrorMock,
}));

const webhookInboundAddMock = mock();
const webhookDeliveryAddMock = mock();
const providerCallbackAddMock = mock();
const reconcileAddMock = mock();

mock.module("~/server/tasks/queues", () => ({
  webhookInboundQueue: { add: webhookInboundAddMock },
  webhookDeliveryQueue: { add: webhookDeliveryAddMock },
  providerCallbackQueue: { add: providerCallbackAddMock },
  reconcileQueue: { add: reconcileAddMock },
}));

mock.module("~/server/tasks/queue-policy", () => ({
  QUEUE_POLICIES: {
    webhookInbound: {
      jobName: "provider.webhook.process",
      attempts: 5,
      backoffDelayMs: 2000,
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
    webhookDelivery: {
      jobName: "merchant.webhook.deliver",
      attempts: 8,
      backoffDelayMs: 3000,
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
    providerCallback: {
      jobName: "provider.callback.process",
      attempts: 5,
      backoffDelayMs: 2000,
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
    reconcile: {
      jobName: "payment.reconcile.single",
      attempts: 3,
      backoffDelayMs: 5000,
      removeOnComplete: 500,
      removeOnFail: 2000,
    },
  },
}));

const handler = (await import("~/server/api/internal/queues/dlq/retry.post")).default;

describe("POST /api/internal/queues/dlq/retry", () => {
  beforeEach(() => {
    readBodyMock.mockReset();
    webhookInboundAddMock.mockReset();
    webhookDeliveryAddMock.mockReset();
    providerCallbackAddMock.mockReset();
    reconcileAddMock.mockReset();

    webhookInboundAddMock.mockResolvedValue(undefined);
    webhookDeliveryAddMock.mockResolvedValue(undefined);
    providerCallbackAddMock.mockResolvedValue(undefined);
    reconcileAddMock.mockResolvedValue(undefined);
  });

  it("requeues webhookInbound DLQ jobs using queue policy", async () => {
    readBodyMock.mockResolvedValue({
      queue: "webhookInbound",
      jobs: [
        {
          originalJobId: "abc123",
          payload: { webhookEventId: "evt_123" },
        },
      ],
    });

    const result = await handler({} as any);

    expect(result.ok).toBe(true);
    expect(result.queue).toBe("webhookInbound");
    expect(result.retried).toBe(1);

    expect(webhookInboundAddMock).toHaveBeenCalledTimes(1);
    expect(webhookInboundAddMock).toHaveBeenCalledWith(
      "provider.webhook.process",
      { webhookEventId: "evt_123" },
      expect.objectContaining({
        attempts: 5,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }),
    );
  });

  it("throws 400 when queue or jobs are missing", async () => {
    readBodyMock.mockResolvedValue({
      queue: "webhookInbound",
      jobs: [],
    });

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: "queue and jobs[] are required",
    });

    expect(webhookInboundAddMock).not.toHaveBeenCalled();
  });

  it("routes reconcile redrive to reconcile queue", async () => {
    readBodyMock.mockResolvedValue({
      queue: "reconcile",
      jobs: [
        {
          originalJobId: "pay_001",
          payload: { paymentIntentId: "pi_001" },
        },
      ],
    });

    const result = await handler({} as any);

    expect(result.ok).toBe(true);
    expect(reconcileAddMock).toHaveBeenCalledTimes(1);
    expect(reconcileAddMock).toHaveBeenCalledWith(
      "payment.reconcile.single",
      { paymentIntentId: "pi_001" },
      expect.objectContaining({
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }),
    );
  });
});