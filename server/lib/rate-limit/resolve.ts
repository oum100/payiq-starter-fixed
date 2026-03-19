import type { H3Event } from "h3";
import { ROUTE_LIMITS, MERCHANT_LIMITS } from "./config";
import type { ResolvedRateLimitPolicy, RouteGroup } from "./types";

function detectRouteGroup(event: H3Event): RouteGroup | null {
  const method = event.method.toUpperCase();
  const path = event.path;

  if (method === "POST" && path.startsWith("/api/v1/payment-intents")) {
    return "payments:create";
  }

  if (method === "GET" && path.startsWith("/api/v1/payment-intents/")) {
    return "payments:read";
  }

  if (path.startsWith("/api/v1/api-keys")) {
    return "apiKeys:manage";
  }

  return null;
}

export function resolveRateLimitPolicies(
  event: H3Event,
  input: {
    apiKeyId: string;
    merchantAccountId?: string | null;
  },
): ResolvedRateLimitPolicy[] {
  const routeGroup = detectRouteGroup(event);
  if (!routeGroup) return [];

  const base = ROUTE_LIMITS[routeGroup];

  const policies: ResolvedRateLimitPolicy[] = [
    {
      scope: "apiKey",
      identifier: input.apiKeyId,
      routeGroup,
      capacity: base.capacity,
      refillRatePerSec: base.refillRatePerSec,
      cost: base.cost ?? 1,
      ttlSec: base.ttlSec ?? 300,
      blockDurationSec: base.blockDurationSec ?? 0,
    },
  ];

  if (
    routeGroup === "payments:create" &&
    input.merchantAccountId &&
    MERCHANT_LIMITS["payments:create"]
  ) {
    const merchantBase = MERCHANT_LIMITS["payments:create"];

    policies.push({
      scope: "merchant",
      identifier: input.merchantAccountId,
      routeGroup,
      capacity: merchantBase.capacity,
      refillRatePerSec: merchantBase.refillRatePerSec,
      cost: merchantBase.cost,
      ttlSec: merchantBase.ttlSec,
      blockDurationSec: merchantBase.blockDurationSec,
    });
  }

  return policies;
}