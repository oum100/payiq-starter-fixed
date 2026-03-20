import { redis } from "../redis";
import { TOKEN_BUCKET_LUA } from "./script";
import type { CheckPolicyInput, RateLimitDecision } from "./types";

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export const rateLimitService = {
  async check(input: CheckPolicyInput): Promise<RateLimitDecision> {
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

    const allowed = toNumber(raw?.[0], 0) === 1;
    const remaining = Math.max(0, toNumber(raw?.[1], 0));
    const retryAfterSec = Math.max(0, toNumber(raw?.[2], 0));
    const resetAfterSec = Math.max(0, toNumber(raw?.[3], 0));
    const blocked = toNumber(raw?.[4], 0) === 1;
    const blockRemainingSec = Math.max(0, toNumber(raw?.[5], 0));

    return {
      allowed,
      remaining,
      retryAfterSec,
      resetAfterSec,
      blocked,
      blockRemainingSec,
    };
  },
};