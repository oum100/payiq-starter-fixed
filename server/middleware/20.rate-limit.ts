import {
  createError,
  defineEventHandler,
  getHeader,
  setResponseHeader,
} from "h3";
import { resolveRateLimitPolicy } from "../lib/rate-limit/resolve";
import { rateLimitService } from "../lib/rate-limit/service";

function extractApiKeyPrefix(rawApiKey?: string | null): string | null {
  if (!rawApiKey) return null;

  const parts = rawApiKey.split(".");
  if (parts.length !== 2) return null;

  const [prefix, secret] = parts;
  if (!prefix || !secret) return null;

  return prefix;
}

export default defineEventHandler(async (event) => {
  const rawApiKey = getHeader(event, "x-api-key");
  const apiKeyPrefix = extractApiKeyPrefix(rawApiKey);

  // ถ้า request นี้ไม่มี API key ที่ parse ได้ ก็ปล่อยผ่าน
  // auth layer เดิมของคุณจะเป็นคน reject เอง
  if (!apiKeyPrefix) {
    return;
  }

  const policies = resolveRateLimitPolicy(event, { apiKeyPrefix });
  if (!policies.length) {
    return;
  }

  let minRemaining = Number.MAX_SAFE_INTEGER;
  let maxReset = 0;
  let appliedLimit = 0;

  for (const policy of policies) {
    const decision = await rateLimitService.check(policy);

    if (!decision.allowed) {
      setResponseHeader(event, "Retry-After", decision.retryAfterSec);
      setResponseHeader(event, "X-RateLimit-Limit", String(policy.capacity));
      setResponseHeader(event, "X-RateLimit-Remaining", "0");
      setResponseHeader(
        event,
        "X-RateLimit-Reset",
        String(decision.resetAfterSec),
      );

      throw createError({
        statusCode: 429,
        statusMessage: "Too Many Requests",
        data: {
          code: "RATE_LIMIT_EXCEEDED",
          routeGroup: policy.routeGroup,
          scope: policy.scope,
          retryAfterSec: decision.retryAfterSec,
        },
      });
    }

    minRemaining = Math.min(minRemaining, decision.remaining);
    maxReset = Math.max(maxReset, decision.resetAfterSec);
    appliedLimit = Math.max(appliedLimit, policy.capacity);
  }

  if (appliedLimit > 0) {
    setResponseHeader(event, "X-RateLimit-Limit", String(appliedLimit));
    setResponseHeader(event, "X-RateLimit-Remaining", String(minRemaining));
    setResponseHeader(event, "X-RateLimit-Reset", String(maxReset));
  }
});
