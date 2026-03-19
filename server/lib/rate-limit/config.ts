import type { RouteGroup, TokenBucketPolicy } from "./types";

export const ROUTE_LIMITS: Record<RouteGroup, TokenBucketPolicy> = {
  "payments:create": {
    capacity: 20,
    refillRatePerSec: 5,
    cost: 1,
    ttlSec: 300,
    blockDurationSec: 2,
  },

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

export const MERCHANT_LIMITS = {
  "payments:create": {
    capacity: 60,
    refillRatePerSec: 10,
    cost: 1,
    ttlSec: 300,
    blockDurationSec: 3,
  },
} as const;

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
};