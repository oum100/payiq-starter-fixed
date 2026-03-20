import { redis } from "../redis";

type CheckPolicyInput = {
  key: string;
  capacity: number;
  windowSec: number;
  scope: "global" | "tenant" | "apiKey";
  routeGroup: string;
};

type CheckDecision = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: string;
  resetAfterSec: number;
};

export const rateLimitService = {
  async check(policy: CheckPolicyInput): Promise<CheckDecision> {
    const multi = redis.multi();
    multi.incr(policy.key);
    multi.ttl(policy.key);
    multi.expire(policy.key, policy.windowSec);

    const results = await multi.exec();

    const count = Number(results?.[0]?.[1] ?? 0);
    let ttl = Number(results?.[1]?.[1] ?? -1);

    if (ttl < 0) {
      ttl = policy.windowSec;
    }

    const allowed = count <= policy.capacity;
    const remaining = Math.max(0, policy.capacity - count);
    const retryAfterSec = String(Math.max(1, ttl));
    const resetAfterSec = Math.max(1, ttl);

    return {
      allowed,
      remaining,
      retryAfterSec,
      resetAfterSec,
    };
  },
};