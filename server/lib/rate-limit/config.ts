import type {
  AbuseRouteGroup,
  RouteGroup,
  TokenBucketPolicy,
} from "./types";

export const ROUTE_LIMITS: Record<AbuseRouteGroup, TokenBucketPolicy> = {
  "payments:read": {
    capacity: 120,
    refillRatePerSec: 30,
    cost: 1,
    ttlSec: 120,
    blockDurationSec: 0,
  },
  "apiKeys:manage": {
    capacity: 10,
    refillRatePerSec: 0.2,
    cost: 1,
    ttlSec: 3600,
    blockDurationSec: 30,
  },
  "auth:malformed": {
    capacity: 8,
    refillRatePerSec: 0.2,
    cost: 1,
    ttlSec: 3600,
    blockDurationSec: 300,
  },
  "auth:unknown": {
    capacity: 12,
    refillRatePerSec: 0.25,
    cost: 1,
    ttlSec: 3600,
    blockDurationSec: 300,
  },
  "auth:failed": {
    capacity: 10,
    refillRatePerSec: 0.2,
    cost: 1,
    ttlSec: 3600,
    blockDurationSec: 300,
  },
};

export const PAYMENT_SPAM_LIMITS = {
  duplicateReference: {
    ttlSec: 30,
    threshold: 10,
    blockSec: 30,
  },
  amountVelocity: {
    ttlSec: 10,
    threshold: 25,
    blockSec: 15,
  },
} as const;

export function getAbuseRoutePolicy(routeGroup: RouteGroup): TokenBucketPolicy {
  const policy = ROUTE_LIMITS[routeGroup as AbuseRouteGroup];
  if (!policy) {
    throw new Error(`No abuse route policy configured for routeGroup=${routeGroup}`);
  }
  return policy;
}
