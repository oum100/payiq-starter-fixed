import type { H3Event } from "h3";
import { ROUTE_LIMITS } from "./config";
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

export function resolveRateLimitPolicy(
  event: H3Event,
  input: {
    apiKeyPrefix: string;
  },
): ResolvedRateLimitPolicy[] {
  const routeGroup = detectRouteGroup(event);
  if (!routeGroup) return [];

  const base = ROUTE_LIMITS[routeGroup];

  return [
    {
      scope: "apiKey",
      identifier: input.apiKeyPrefix,
      routeGroup,
      capacity: base.capacity,
      refillRatePerSec: base.refillRatePerSec,
      cost: base.cost ?? 1,
      ttlSec: base.ttlSec ?? 300,
    },
  ];
}