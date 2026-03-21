import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import type { H3Event } from "h3";
import { prisma } from "~/server/lib/prisma";
import { AppError } from "~/server/lib/errors";

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LOCK_TIMEOUT_MS = 30 * 1000;

type JsonLike =
  | null
  | boolean
  | number
  | string
  | JsonLike[]
  | { [key: string]: JsonLike };

export interface ReserveIdempotencyInput {
  tenantId: string;
  key?: string | null;
  requestPath: string;
  requestMethod: string;
  requestBody: unknown;
  ttlMs?: number;
  lockTimeoutMs?: number;
  event?: H3Event;
}

export interface ReserveIdempotencyResult {
  key: string;
  requestHash: string;
  status: "STARTED" | "REPLAY";
  responseStatusCode?: number | null;
  responseBody?: unknown;
  resourceType?: string | null;
  resourceId?: string | null;
}

export interface CompleteIdempotencyInput {
  tenantId: string;
  key?: string | null;
  responseStatusCode: number;
  responseBody: unknown;
  resourceType?: string | null;
  resourceId?: string | null;
}

export interface ReleaseIdempotencyLockInput {
  tenantId: string;
  key?: string | null;
}

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

function nowPlus(ms: number) {
  return new Date(Date.now() + ms);
}

function getRetryAfterSeconds(lockedAt: Date, lockTimeoutMs: number) {
  const remainingMs = lockedAt.getTime() + lockTimeoutMs - Date.now();
  return Math.max(1, Math.ceil(remainingMs / 1000));
}

function setHeader(
  event: H3Event | undefined,
  name: string,
  value: string | number,
) {
  if (!event) return;
  event.node.res.setHeader(name, value);
}

function setIdempotencyStatus(event: H3Event | undefined, status: string) {
  setHeader(event, "Idempotency-Status", status);
}

function setIdempotencyKeyHeader(event: H3Event | undefined, key: string) {
  setHeader(event, "Idempotency-Key", key);
}

function setIdempotentReplayedHeader(
  event: H3Event | undefined,
  replayed: boolean,
) {
  setHeader(event, "Idempotent-Replayed", replayed ? "true" : "false");
}

export async function reserveIdempotency(
  input: ReserveIdempotencyInput,
): Promise<ReserveIdempotencyResult | null> {
  if (!input.key) return null;

  const ttlMs = input.ttlMs ?? DEFAULT_TTL_MS;
  const lockTimeoutMs = input.lockTimeoutMs ?? DEFAULT_LOCK_TIMEOUT_MS;
  const requestHash = hashRequestBody(input.requestBody);
  const normalizedRequestMethod = input.requestMethod.toUpperCase();

  while (true) {
    const now = new Date();

    const existing = await prisma.idempotencyKey.findUnique({
      where: {
        tenantId_key: {
          tenantId: input.tenantId,
          key: input.key,
        },
      },
    });

    if (!existing) {
      try {
        await prisma.idempotencyKey.create({
          data: {
            tenantId: input.tenantId,
            key: input.key,
            requestPath: input.requestPath,
            requestMethod: normalizedRequestMethod,
            requestHash,
            lockedAt: now,
            completedAt: null,
            responseStatusCode: null,
            responseBody: Prisma.JsonNull,
            resourceType: null,
            resourceId: null,
            expiresAt: nowPlus(ttlMs),
          },
        });

        setIdempotencyStatus(input.event, "created");
        setIdempotencyKeyHeader(input.event, input.key);
        setIdempotentReplayedHeader(input.event, false);

        return {
          key: input.key,
          requestHash,
          status: "STARTED",
        };
      } catch (error: any) {
        if (error?.code === "P2002") continue;
        throw error;
      }
    }

    if (existing.expiresAt && existing.expiresAt.getTime() <= now.getTime()) {
      const reclaimed = await prisma.idempotencyKey.updateMany({
        where: {
          tenantId: input.tenantId,
          key: input.key,
          updatedAt: existing.updatedAt,
        },
        data: {
          requestPath: input.requestPath,
          requestMethod: normalizedRequestMethod,
          requestHash,
          lockedAt: now,
          completedAt: null,
          responseStatusCode: null,
          responseBody: Prisma.JsonNull,
          resourceType: null,
          resourceId: null,
          expiresAt: nowPlus(ttlMs),
        },
      });

      if (reclaimed.count === 1) {
        setIdempotencyStatus(input.event, "created");
        setIdempotencyKeyHeader(input.event, input.key);
        setIdempotentReplayedHeader(input.event, false);

        return {
          key: input.key,
          requestHash,
          status: "STARTED",
        };
      }

      continue;
    }

    if (
      existing.requestHash !== requestHash ||
      (existing.requestPath && existing.requestPath !== input.requestPath) ||
      (existing.requestMethod &&
        existing.requestMethod !== normalizedRequestMethod)
    ) {
      setIdempotencyStatus(input.event, "conflict");
      setIdempotencyKeyHeader(input.event, input.key);

      throw new AppError(
        "IDEMPOTENCY_KEY_CONFLICT",
        "Idempotency-Key was already used with a different request payload",
        409,
      );
    }

    if (existing.completedAt) {
      setIdempotencyStatus(input.event, "replay");
      setIdempotencyKeyHeader(input.event, input.key);
      setIdempotentReplayedHeader(input.event, true);

      return {
        key: existing.key,
        requestHash: existing.requestHash,
        status: "REPLAY",
        responseStatusCode: existing.responseStatusCode,
        responseBody: existing.responseBody,
        resourceType: existing.resourceType,
        resourceId: existing.resourceId,
      };
    }

    if (existing.lockedAt) {
      const ageMs = now.getTime() - existing.lockedAt.getTime();

      if (ageMs < lockTimeoutMs) {
        setIdempotencyStatus(input.event, "in_progress");
        setIdempotencyKeyHeader(input.event, input.key);

        throw new AppError(
          "IDEMPOTENCY_IN_PROGRESS",
          "A request with this Idempotency-Key is already in progress",
          409,
          {
            retryAfterSec: getRetryAfterSeconds(
              existing.lockedAt,
              lockTimeoutMs,
            ),
          },
        );
      }
    }

    const claimed = await prisma.idempotencyKey.updateMany({
      where: {
        tenantId: input.tenantId,
        key: input.key,
        updatedAt: existing.updatedAt,
      },
      data: {
        lockedAt: now,
        expiresAt: nowPlus(ttlMs),
      },
    });

    if (claimed.count === 1) {
      setIdempotencyStatus(input.event, "created");
      setIdempotencyKeyHeader(input.event, input.key);
      setIdempotentReplayedHeader(input.event, false);

      return {
        key: input.key,
        requestHash,
        status: "STARTED",
      };
    }
  }
}

export async function completeIdempotency(
  input: CompleteIdempotencyInput,
): Promise<void> {
  if (!input.key) return;

  await prisma.idempotencyKey.update({
    where: {
      tenantId_key: {
        tenantId: input.tenantId,
        key: input.key,
      },
    },
    data: {
      completedAt: new Date(),
      lockedAt: null,
      expiresAt: nowPlus(DEFAULT_TTL_MS),
      responseStatusCode: input.responseStatusCode,
      responseBody: input.responseBody as Prisma.InputJsonValue,
      resourceType: input.resourceType ?? null,
      resourceId: input.resourceId ?? null,
    },
  });
}

export async function releaseIdempotencyLock(
  input: ReleaseIdempotencyLockInput,
): Promise<void> {
  if (!input.key) return;

  await prisma.idempotencyKey.update({
    where: {
      tenantId_key: {
        tenantId: input.tenantId,
        key: input.key,
      },
    },
    data: {
      lockedAt: null,
    },
  });
}
