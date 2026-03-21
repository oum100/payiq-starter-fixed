import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";

const readBodyMock = mock();

mock.module("h3", () => ({
  defineEventHandler: (fn: any) => fn,
  readBody: readBodyMock,
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

    if (typeof input.statusCode !== "undefined") {
      err.statusCode = input.statusCode;
    }

    const statusMessage = input.statusMessage || input.message;
    if (typeof statusMessage !== "undefined") {
      err.statusMessage = statusMessage;
    }

    return err;
  },
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

const webhookEventFindUniqueMock = mock();

mock.module("~/server/lib/prisma", () => ({
  prisma: {
    webhookEvent: {
      findUnique: webhookEventFindUniqueMock,
    },
  },
}));

const handler = (await import("~/server/api/internal/queues/dlq/retry.post"))
  .default;

function makeEvent() {
  return {
    context: {},
    node: {},
    req: {},
    res: {},
    method: "POST",
    headers: {},
    path: "/api/internal/queues/dlq/retry",
  } as any;
}

describe("POST /api/internal/queues/dlq/retry", () => {
  beforeEach(() => {
    readBodyMock.mockReset();
    webhookInboundAddMock.mockReset();
    webhookDeliveryAddMock.mockReset();
    providerCallbackAddMock.mockReset();
    reconcileAddMock.mockReset();
    webhookEventFindUniqueMock.mockReset();

    webhookInboundAddMock.mockResolvedValue(undefined);
    webhookDeliveryAddMock.mockResolvedValue(undefined);
    providerCallbackAddMock.mockResolvedValue(undefined);
    reconcileAddMock.mockResolvedValue(undefined);
    webhookEventFindUniqueMock.mockResolvedValue({
      id: "wh_123",
      tenantId: "tenant_1",
      provider: "SCB",
    });
  });

  afterAll(() => {
    mock.restore();
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

    const result = await handler(makeEvent());

    expect(result.ok).toBe(true);
    expect(result.queue).toBe("webhookInbound");
    expect(result.retried).toBe(1);

    expect(webhookEventFindUniqueMock).toHaveBeenCalledTimes(1);

    expect(webhookInboundAddMock).toHaveBeenCalledTimes(1);

    const [jobName, payload, options] = webhookInboundAddMock.mock.calls[0]!;

    expect(jobName).toBe("provider.webhook.process");
    expect(payload).toEqual(
      expect.objectContaining({
        webhookEventId: "evt_123",
      }),
    );
    expect(options).toEqual(
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

    await expect(handler(makeEvent())).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: "queue and jobs[] are required",
    });
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

    const result = await handler(makeEvent());

    expect(result.ok).toBe(true);
    expect(reconcileAddMock).toHaveBeenCalledTimes(1);

    const [jobName, payload, options] = reconcileAddMock.mock.calls[0]!;

    expect(jobName).toBe("payment.reconcile.single");
    expect(payload).toEqual(
      expect.objectContaining({
        paymentIntentId: "pi_001",
        meta: expect.objectContaining({
          redriveQueue: "reconcile",
          redriven: true,
          redrivenFromDlq: true,
        }),
      }),
    );
    expect(options).toEqual(
      expect.objectContaining({
        attempts: 3,
        removeOnComplete: 500,
        removeOnFail: 2000,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }),
    );
    expect(String(options.jobId)).toContain("reconcile__redrive__pay_001");
  });
});
