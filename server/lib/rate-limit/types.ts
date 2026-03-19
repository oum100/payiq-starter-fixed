export type RateLimitScope = "apiKey";

export type RouteGroup =
  | "payments:create"
  | "payments:read"
  | "apiKeys:manage";

export interface TokenBucketPolicy {
  capacity: number;
  refillRatePerSec: number;
  cost?: number;
  ttlSec?: number;
}

export interface ResolvedRateLimitPolicy {
  scope: RateLimitScope;
  identifier: string;
  routeGroup: RouteGroup;
  capacity: number;
  refillRatePerSec: number;
  cost: number;
  ttlSec: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
  resetAfterSec: number;
}