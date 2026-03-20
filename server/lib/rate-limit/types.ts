export type RateLimitScope =
  | "global"
  | "tenant"
  | "apiKey"
  | "merchant"
  | "ip";

export type RouteGroup =
  | "payments:create"
  | "payments:read"
  | "apiKeys:list"
  | "apiKeys:create"
  | "apiKeys:rotate"
  | "apiKeys:revoke"
  | "apiKeys:manage"
  | "auth:malformed"
  | "auth:unknown"
  | "auth:failed";

export interface TokenBucketPolicy {
  capacity: number;
  refillRatePerSec: number;
  cost?: number;
  ttlSec?: number;
  blockDurationSec?: number;
}

export interface NormalizedTokenBucketPolicy {
  capacity: number;
  refillRatePerSec: number;
  cost: number;
  ttlSec: number;
  blockDurationSec: number;
}

export interface WindowRateLimitPolicy {
  routeGroup: RouteGroup;
  scope: Extract<RateLimitScope, "global" | "tenant" | "apiKey">;
  capacity: number;
  windowSec: number;
}

export interface RateLimitSubject {
  identifier: string;
}

export interface CheckPolicyInput {
  key: string;
  windowSec: number;

  scope: RateLimitScope;
  identifier: string;
  routeGroup: RouteGroup;

  capacity: number;
  refillRatePerSec: number;
  cost: number;
  ttlSec: number;
  blockDurationSec: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
  resetAfterSec: number;
  blocked: boolean;
  blockRemainingSec: number;
}

export const DEFAULT_RATE_LIMIT_COST = 1;
export const DEFAULT_RATE_LIMIT_TTL_SEC = 3600;
export const DEFAULT_RATE_LIMIT_BLOCK_DURATION_SEC = 0;

export function normalizeTokenBucketPolicy(
  policy: TokenBucketPolicy,
): NormalizedTokenBucketPolicy {
  return {
    capacity: policy.capacity,
    refillRatePerSec: policy.refillRatePerSec,
    cost: policy.cost ?? DEFAULT_RATE_LIMIT_COST,
    ttlSec: policy.ttlSec ?? DEFAULT_RATE_LIMIT_TTL_SEC,
    blockDurationSec:
      policy.blockDurationSec ?? DEFAULT_RATE_LIMIT_BLOCK_DURATION_SEC,
  };
}

export function buildRateLimitKey(
  scope: RateLimitScope,
  identifier: string,
  routeGroup: RouteGroup,
) {
  return `rl:tb:v2:${scope}:${identifier}:${routeGroup}`;
}

export function toCheckPolicyInput(
  routeGroup: RouteGroup,
  scope: RateLimitScope,
  subject: RateLimitSubject,
  policy: TokenBucketPolicy,
): CheckPolicyInput {
  const normalized = normalizeTokenBucketPolicy(policy);

  return {
    key: buildRateLimitKey(scope, subject.identifier, routeGroup),
    windowSec: normalized.ttlSec,

    scope,
    identifier: subject.identifier,
    routeGroup,

    capacity: normalized.capacity,
    refillRatePerSec: normalized.refillRatePerSec,
    cost: normalized.cost,
    ttlSec: normalized.ttlSec,
    blockDurationSec: normalized.blockDurationSec,
  };
}

export function windowPolicyToCheckPolicyInput(
  policy: WindowRateLimitPolicy,
  subject: RateLimitSubject,
): CheckPolicyInput {
  const refillRatePerSec =
    policy.windowSec > 0 ? policy.capacity / policy.windowSec : 0;

  return {
    key: buildRateLimitKey(policy.scope, subject.identifier, policy.routeGroup),
    windowSec: policy.windowSec,

    scope: policy.scope,
    identifier: subject.identifier,
    routeGroup: policy.routeGroup,

    capacity: policy.capacity,
    refillRatePerSec,
    cost: 1,
    ttlSec: policy.windowSec,
    blockDurationSec: 0,
  };
}