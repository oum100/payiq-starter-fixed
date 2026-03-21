import type { H3Event } from "h3";
import { RATE_LIMIT_POLICIES, type RouteGroup } from "./policies";
import { windowPolicyToCheckPolicyInput, type CheckPolicyInput } from "./types";

type ResolveInput = {
  apiKeyId?: string | null;
  merchantAccountId?: string | null;
};

function getMethod(event: H3Event): string {
  return String(
    (event as any).method ?? (event as any).node?.req?.method ?? "",
  ).toUpperCase();
}

function getPath(event: H3Event): string {
  const rawPath = (event as any).path ?? (event as any).node?.req?.url ?? "";

  return String(rawPath).split("?")[0] || "";
}

function resolveRouteGroup(event: H3Event): RouteGroup | null {
  const path = getPath(event);
  const method = getMethod(event);

  if (method === "POST" && path === "/api/v1/payment-intents") {
    return "payments:create";
  }

  if (method === "GET" && path === "/api/v1/api-keys") {
    return "apiKeys:list";
  }

  if (method === "POST" && path === "/api/v1/api-keys") {
    return "apiKeys:create";
  }

  if (method === "POST" && /\/api\/v1\/api-keys\/[^/]+\/rotate$/.test(path)) {
    return "apiKeys:rotate";
  }

  if (method === "POST" && /\/api\/v1\/api-keys\/[^/]+\/revoke$/.test(path)) {
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
  const result: CheckPolicyInput[] = [];

  for (const def of defs) {
    if (def.scope === "global") {
      result.push(
        windowPolicyToCheckPolicyInput(def, {
          identifier: "global",
        }),
      );
      continue;
    }

    if (def.scope === "tenant") {
      if (!input.merchantAccountId) continue;

      result.push(
        windowPolicyToCheckPolicyInput(def, {
          identifier: input.merchantAccountId,
        }),
      );
      continue;
    }

    if (def.scope === "apiKey") {
      if (!input.apiKeyId) continue;

      result.push(
        windowPolicyToCheckPolicyInput(def, {
          identifier: input.apiKeyId,
        }),
      );
      continue;
    }
  }

  return result;
}
