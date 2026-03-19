export type RateLimitScope = "apiKey" | "merchant" | "ip";

export type RouteGroup =
  | "payments:create"
  | "payments:read"
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

export interface ResolvedRateLimitPolicy {
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