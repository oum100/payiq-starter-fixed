import type { H3Event } from "h3";
import { RATE_LIMIT_POLICIES } from "./policies";
import { windowPolicyToCheckPolicyInput, type CheckPolicyInput } from "./types";

type ResolveInput = {
  apiKeyId?: string | null;
  merchantAccountId?: string | null;
};

type ResolvedRouteGroup =
  | "payments:create"
  | "apiKeys:list"
  | "apiKeys:create"
  | "apiKeys:rotate"
  | "apiKeys:revoke";

function resolveRouteGroup(event: H3Event): ResolvedRouteGroup | null {
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

  if (
    event.method === "POST" &&
    /\/api\/v1\/api-keys\/[^/]+\/rotate$/.test(path)
  ) {
    return "apiKeys:rotate";
  }

  if (
    event.method === "POST" &&
    /\/api\/v1\/api-keys\/[^/]+\/revoke$/.test(path)
  ) {
    return "apiKeys:revoke";
  }

  return null;
}

export function resolveRateLimitPolicies(
  event: H3Event,
  input: ResolveInput,
): CheckPolicyInput[] {
  const routeGroup = resolveRouteGroup(event);
  if (!routeGroup) return [];

  const defs = RATE_LIMIT_POLICIES[routeGroup] ?? [];
  const items: CheckPolicyInput[] = [];

  for (const def of defs) {
    if (def.scope === "global") {
      items.push(
        windowPolicyToCheckPolicyInput(def, {
          identifier: "global",
        }),
      );
      continue;
    }

    if (def.scope === "tenant" && input.merchantAccountId) {
      items.push(
        windowPolicyToCheckPolicyInput(def, {
          identifier: input.merchantAccountId,
        }),
      );
      continue;
    }

    if (def.scope === "apiKey" && input.apiKeyId) {
      items.push(
        windowPolicyToCheckPolicyInput(def, {
          identifier: input.apiKeyId,
        }),
      );
    }
  }

  return items;
}