import { beforeEach, describe, expect, it, mock } from "bun:test";
import { createHash } from "node:crypto";

const findUniqueMock = mock();
const createMock = mock();
const updateMock = mock();
const updateManyMock = mock();

mock.module("~/server/lib/prisma", () => ({
  prisma: {
    idempotencyKey: {
      findUnique: findUniqueMock,
      create: createMock,
      update: updateMock,
      updateMany: updateManyMock,
    },
  },
}));

const { reserveIdempotency, completeIdempotency, releaseIdempotencyLock } =
  await import("~/server/services/idempotency/reserveIdempotency");

type JsonLike =
  | null
  | boolean
  | number
  | string
  | JsonLike[]
  | { [key: string]: JsonLike };

function canonicalize(value: unknown): JsonLike {
  if (value === null) return null;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, JsonLike> = {};

    for (const key of Object.keys(input).sort()) {
      const v = input[key];
      if (typeof v === "undefined") continue;
      output[key] = canonicalize(v);
    }

    return output;
  }

  return String(value);
}

function hashRequestBody(body: unknown): string {
  const normalized = canonicalize(body);
  const serialized = JSON.stringify(normalized);
  return createHash("sha256").update(serialized).digest("hex");
}

const REQUEST_BODY = {
  amount: "20.00",
  paymentMethodType: "PROMPTPAY_QR",
};

const MATCHING_REQUEST_HASH = hashRequestBody(REQUEST_BODY);

describe("reserveIdempotency edge cases", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    createMock.mockReset();
    updateMock.mockReset();
    updateManyMock.mockReset();
  });

  it("returns REPLAY for same key and same completed request", async () => {
    findUniqueMock.mockResolvedValue({
      tenantId: "tenant_1",
      key: "idem_1",
      requestHash: MATCHING_REQUEST_HASH,
      completedAt: new Date(),
      lockedAt: null,
      responseStatusCode: 200,
      responseBody: { ok: true, publicId: "piq_1" },
      resourceType: "PaymentIntent",
      resourceId: "pi_1",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const result = await reserveIdempotency({
      tenantId: "tenant_1",
      key: "idem_1",
      requestPath: "/api/v1/payment-intents",
      requestMethod: "POST",
      requestBody: REQUEST_BODY,
    });

    expect(result?.status).toBe("REPLAY");
    expect(result?.responseBody).toEqual({ ok: true, publicId: "piq_1" });
  });

  it("throws conflict for same key with different payload", async () => {
    findUniqueMock.mockResolvedValue({
      tenantId: "tenant_1",
      key: "idem_1",
      requestHash: "different_hash",
      completedAt: null,
      lockedAt: null,
      responseStatusCode: null,
      responseBody: null,
      resourceType: null,
      resourceId: null,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      reserveIdempotency({
        tenantId: "tenant_1",
        key: "idem_1",
        requestPath: "/api/v1/payment-intents",
        requestMethod: "POST",
        requestBody: REQUEST_BODY,
      }),
    ).rejects.toMatchObject({
      code: "IDEMPOTENCY_KEY_CONFLICT",
      statusCode: 409,
    });
  });

  it("throws in-progress when lock is still active", async () => {
    findUniqueMock.mockResolvedValue({
      tenantId: "tenant_1",
      key: "idem_1",
      requestHash: MATCHING_REQUEST_HASH,
      completedAt: null,
      lockedAt: new Date(),
      responseStatusCode: null,
      responseBody: null,
      resourceType: null,
      resourceId: null,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      reserveIdempotency({
        tenantId: "tenant_1",
        key: "idem_1",
        requestPath: "/api/v1/payment-intents",
        requestMethod: "POST",
        requestBody: REQUEST_BODY,
      }),
    ).rejects.toMatchObject({
      code: "IDEMPOTENCY_IN_PROGRESS",
      statusCode: 409,
    });
  });

  it("reclaims expired key and starts again", async () => {
    findUniqueMock.mockResolvedValue({
      tenantId: "tenant_1",
      key: "idem_1",
      requestHash: "old_hash",
      completedAt: null,
      lockedAt: new Date(Date.now() - 120_000),
      responseStatusCode: null,
      responseBody: null,
      resourceType: null,
      resourceId: null,
      expiresAt: new Date(Date.now() - 60_000),
      updatedAt: new Date("2026-03-20T00:00:00.000Z"),
    });

    updateManyMock.mockResolvedValue({ count: 1 });

    const result = await reserveIdempotency({
      tenantId: "tenant_1",
      key: "idem_1",
      requestPath: "/api/v1/payment-intents",
      requestMethod: "POST",
      requestBody: REQUEST_BODY,
    });

    expect(result?.status).toBe("STARTED");
    expect(updateManyMock).toHaveBeenCalledTimes(1);
  });

  it("allows same key name across different tenants", async () => {
    createMock.mockResolvedValue({});
    findUniqueMock.mockResolvedValue(null);

    const a = await reserveIdempotency({
      tenantId: "tenant_a",
      key: "idem_same",
      requestPath: "/api/v1/payment-intents",
      requestMethod: "POST",
      requestBody: REQUEST_BODY,
    });

    const b = await reserveIdempotency({
      tenantId: "tenant_b",
      key: "idem_same",
      requestPath: "/api/v1/payment-intents",
      requestMethod: "POST",
      requestBody: REQUEST_BODY,
    });

    expect(a?.status).toBe("STARTED");
    expect(b?.status).toBe("STARTED");
    expect(createMock).toHaveBeenCalledTimes(2);
    expect(createMock.mock.calls[0]?.[0]?.data.tenantId).toBe("tenant_a");
    expect(createMock.mock.calls[1]?.[0]?.data.tenantId).toBe("tenant_b");
  });

  it("completes and releases lock helpers without error", async () => {
    updateMock.mockResolvedValue({});

    await completeIdempotency({
      tenantId: "tenant_1",
      key: "idem_1",
      responseStatusCode: 200,
      responseBody: { ok: true },
      resourceType: "PaymentIntent",
      resourceId: "pi_1",
    });

    await releaseIdempotencyLock({
      tenantId: "tenant_1",
      key: "idem_1",
    });

    expect(updateMock).toHaveBeenCalledTimes(2);
  });
});
