import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";
import { createHash } from "node:crypto";

let reserveIdempotency: any;
let completeIdempotency: any;
let releaseIdempotencyLock: any;

const findUniqueMock = mock();
const createMock = mock();
const updateMock = mock();
const updateManyMock = mock();

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

async function loadFreshSubject() {
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

  return await import(
    `../../server/services/idempotency/reserveIdempotency.ts?fresh=${Date.now()}_${Math.random()}`
  );
}

describe("reserveIdempotency edge cases", () => {
  const BASE_INPUT = {
    tenantId: "tenant_1",
    key: "idem_1",
    requestPath: "/api/v1/payment-intents",
    requestMethod: "POST",
    requestBody: { amount: "100" },
  };

  const BASE_HASH = hashRequestBody(BASE_INPUT.requestBody);

  beforeEach(async () => {
    mock.restore();

    findUniqueMock.mockReset();
    createMock.mockReset();
    updateMock.mockReset();
    updateManyMock.mockReset();

    const mod = await loadFreshSubject();
    reserveIdempotency = mod.reserveIdempotency;
    completeIdempotency = mod.completeIdempotency;
    releaseIdempotencyLock = mod.releaseIdempotencyLock;
  });

  afterAll(() => {
    mock.restore();
  });

  it("returns REPLAY for same key and same completed request", async () => {
    findUniqueMock.mockResolvedValue({
      key: "idem_1",
      tenantId: "tenant_1",
      requestHash: BASE_HASH,
      requestMethod: "POST",
      requestPath: "/api/v1/payment-intents",
      completedAt: new Date(),
      lockedAt: null,
      responseStatusCode: 200,
      responseBody: { ok: true },
      resourceType: "PaymentIntent",
      resourceId: "pi_1",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const result = await reserveIdempotency(BASE_INPUT);

    expect(result?.status).toBe("REPLAY");
    expect(result?.requestHash).toBe(BASE_HASH);
  });

  it("throws conflict for same key with different payload", async () => {
    findUniqueMock.mockResolvedValue({
      key: "idem_1",
      tenantId: "tenant_1",
      requestHash: "different_hash",
      requestMethod: "POST",
      requestPath: "/api/v1/payment-intents",
      completedAt: new Date(),
      lockedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(reserveIdempotency(BASE_INPUT)).rejects.toMatchObject({
      code: "IDEMPOTENCY_KEY_CONFLICT",
    });
  });

  it("throws in-progress when lock is still active", async () => {
    findUniqueMock.mockResolvedValue({
      key: "idem_1",
      tenantId: "tenant_1",
      requestHash: BASE_HASH,
      requestMethod: "POST",
      requestPath: "/api/v1/payment-intents",
      completedAt: null,
      lockedAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(reserveIdempotency(BASE_INPUT)).rejects.toMatchObject({
      code: "IDEMPOTENCY_IN_PROGRESS",
    });
  });

  it("reclaims expired key and starts again", async () => {
    const oldUpdatedAt = new Date("2026-03-20T00:00:00.000Z");

    findUniqueMock.mockResolvedValue({
      key: "idem_1",
      tenantId: "tenant_1",
      requestHash: "old_hash",
      requestMethod: "POST",
      requestPath: "/api/v1/payment-intents",
      completedAt: null,
      lockedAt: new Date(Date.now() - 1000 * 60 * 10),
      updatedAt: oldUpdatedAt,
      expiresAt: new Date(Date.now() - 1000),
    });

    updateManyMock.mockResolvedValue({ count: 1 });

    const result = await reserveIdempotency(BASE_INPUT);

    expect(result?.status).toBe("STARTED");
    expect(result?.requestHash).toBe(BASE_HASH);
    expect(updateManyMock).toHaveBeenCalledTimes(1);
  });

  it("allows same key name across different tenants", async () => {
    findUniqueMock.mockResolvedValue(null);
    createMock.mockResolvedValue({});

    const result = await reserveIdempotency({
      ...BASE_INPUT,
      tenantId: "tenant_2",
    });

    expect(result?.status).toBe("STARTED");
    expect(createMock).toHaveBeenCalledTimes(1);
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
