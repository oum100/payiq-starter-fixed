import { redis } from "../redis";
import { TOKEN_BUCKET_LUA } from "./script";
import type { CheckPolicyInput, RateLimitDecision } from "./types";

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function failOpenDecision(input: CheckPolicyInput): RateLimitDecision {
  return {
    allowed: true,
    remaining: Math.max(0, Math.floor(input.capacity)),
    retryAfterSec: 0,
    resetAfterSec: 0,
    blocked: false,
    blockRemainingSec: 0,
  };
}

export const rateLimitService = {
  async check(input: CheckPolicyInput): Promise<RateLimitDecision> {
    try {
      const nowMs = Date.now();

      const raw = (await redis.eval(
        TOKEN_BUCKET_LUA,
        1,
        input.key,
        String(nowMs),
        String(input.capacity),
        String(input.refillRatePerSec),
        String(input.cost),
        String(input.ttlSec),
        String(input.blockDurationSec),
      )) as unknown[];

      if (!Array.isArray(raw) || raw.length < 6) {
        console.error("[rate-limit] invalid redis eval response", {
          key: input.key,
          raw,
        });
        return failOpenDecision(input);
      }

      const allowed = toNumber(raw[0], 0) === 1;
      const remaining = Math.max(0, toNumber(raw[1], 0));
      const retryAfterSec = Math.max(0, toNumber(raw[2], 0));
      const resetAfterSec = Math.max(0, toNumber(raw[3], 0));
      const blocked = toNumber(raw[4], 0) === 1;
      const blockRemainingSec = Math.max(0, toNumber(raw[5], 0));

      return {
        allowed,
        remaining,
        retryAfterSec,
        resetAfterSec,
        blocked,
        blockRemainingSec,
      };
    } catch (error) {
      console.error("[rate-limit] redis check failed; fail-open applied", {
        key: input.key,
        routeGroup: input.routeGroup,
        scope: input.scope,
        error,
      });
      return failOpenDecision(input);
    }
  },
};
