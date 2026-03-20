import type { H3Event } from "h3";
import { RATE_LIMIT_POLICIES, type RateLimitPolicy, type RouteGroup } from "./policies";

type ResolveInput = {
  apiKeyId?: string | null;
  merchantAccountId?: string | null;
};

function resolveRouteGroup(event: H3Event): RouteGroup | null {
  const path = event.path || "";

  if (event.method === "POST" && path === "/api/v1/payment-intents") {
    return "payments:create";
  }

  if (event.method === "GET" && path === "/api/v1/api-keys") {
    return "apiKeys:list";
  }

  if (event.method === "POST" && path === "/api/v1/api-keys") {
    return "apiKeys:create";
  }

  if (event.method === "POST" && /\/api\/v1\/api-keys\/[^/]+\/rotate$/.test(path)) {
    return "apiKeys:rotate";
  }

  if (event.method === "POST" && /\/api\/v1\/api-keys\/[^/]+\/revoke$/.test(path)) {
    return "apiKeys:revoke";
  }

  return null;
}

export function resolveRateLimitPolicies(
  event: H3Event,
  input: ResolveInput,
): Array<RateLimitPolicy & { key: string }> {
  const routeGroup = resolveRouteGroup(event);
  if (!routeGroup) return [];

  const defs = RATE_LIMIT_POLICIES[routeGroup] ?? [];
  const items: Array<RateLimitPolicy & { key: string }> = [];

  for (const def of defs) {
    if (def.scope === "global") {
      items.push({
        ...def,
        key: `ratelimit:${routeGroup}:global`,
      });
      continue;
    }

    if (def.scope === "tenant" && input.merchantAccountId) {
      items.push({
        ...def,
        key: `ratelimit:${routeGroup}:tenant:${input.merchantAccountId}`,
      });
      continue;
    }

    if (def.scope === "apiKey" && input.apiKeyId) {
      items.push({
        ...def,
        key: `ratelimit:${routeGroup}:apiKey:${input.apiKeyId}`,
      });
    }
  }

  return items;
}