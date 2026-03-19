import { redis } from "../redis";
import { buildRateLimitKey, buildTempBlockKey } from "./keys";
import { TOKEN_BUCKET_LUA } from "./script";
import type { RateLimitDecision, ResolvedRateLimitPolicy } from "./types";

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
        policy.blockDurationSec,
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
        policy.blockDurationSec,
      )) as unknown[];
    }

    return {
      allowed: Number(raw[0]) === 1,
      remaining: Number(raw[1]),
      retryAfterSec: Number(raw[2]),
      resetAfterSec: Number(raw[3]),
      blocked: Number(raw[4]) === 1,
      blockRemainingSec: Number(raw[5]),
    };
  }

  async setTempBlock(subject: string, identifier: string, ttlSec: number) {
    await redis.set(buildTempBlockKey(subject, identifier), "1", "EX", ttlSec);
  }

  async getTempBlockTtl(subject: string, identifier: string) {
    const ttl = await redis.ttl(buildTempBlockKey(subject, identifier));
    return ttl > 0 ? ttl : 0;
  }
}

export const rateLimitService = new RateLimitService();
