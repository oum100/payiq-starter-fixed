import type { RouteGroup, TokenBucketPolicy } from "./types";

export const ROUTE_LIMITS: Record<RouteGroup, TokenBucketPolicy> = {
  "payments:create": {
    capacity: 20,
    refillRatePerSec: 2,
    cost: 1,
    ttlSec: 300,
  },

  "payments:read": {
    capacity: 120,
    refillRatePerSec: 30,
    cost: 1,
    ttlSec: 120,
  },

  "apiKeys:manage": {
    capacity: 10,
    refillRatePerSec: 0.2,
    cost: 1,
    ttlSec: 3600,
  },
};