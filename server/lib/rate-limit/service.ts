import { redis } from "../redis";
import { buildRateLimitKey } from "./keys";
import { TOKEN_BUCKET_LUA } from "./script";
import type {
  RateLimitDecision,
  ResolvedRateLimitPolicy,
} from "./types";

let tokenBucketSha: string | null = null;

async function getTokenBucketSha(): Promise<string> {
  if (tokenBucketSha) return tokenBucketSha;
  tokenBucketSha = (await redis.script("LOAD", TOKEN_BUCKET_LUA)) as string;
  return tokenBucketSha;
}

export class RateLimitService {
  async check(policy: ResolvedRateLimitPolicy): Promise<RateLimitDecision> {
    const key = buildRateLimitKey(
      policy.scope,
      policy.identifier,
      policy.routeGroup,
    );

    const nowMs = Date.now();
    const sha = await getTokenBucketSha();

    let raw: unknown[];

    try {
      raw = (await redis.evalsha(
        sha,
        1,
        key,
        nowMs,
        policy.capacity,
        policy.refillRatePerSec,
        policy.cost,
        policy.ttlSec,
      )) as unknown[];
    } catch {
      raw = (await redis.eval(
        TOKEN_BUCKET_LUA,
        1,
        key,
        nowMs,
        policy.capacity,
        policy.refillRatePerSec,
        policy.cost,
        policy.ttlSec,
      )) as unknown[];
    }

    return {
      allowed: Number(raw[0]) === 1,
      remaining: Number(raw[1]),
      retryAfterSec: Number(raw[2]),
      resetAfterSec: Number(raw[3]),
    };
  }
}

export const rateLimitService = new RateLimitService();