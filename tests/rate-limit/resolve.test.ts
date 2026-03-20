import { describe, expect, it } from "bun:test";
import { resolveRateLimitPolicies } from "~/server/lib/rate-limit/resolve";

function makeEvent(method: string, path: string) {
  return { method, path } as any;
}

describe("resolveRateLimitPolicies", () => {
  it("resolves payment-intents create policies", () => {
    const result = resolveRateLimitPolicies(
      makeEvent("POST", "/api/v1/payment-intents"),
      {
        apiKeyId: "ak_1",
        merchantAccountId: "ma_1",
      },
    );

    expect(result).toHaveLength(3);
    expect(result.map((x) => x.scope)).toEqual(["global", "tenant", "apiKey"]);
  });

  it("resolves api-keys list policies", () => {
    const result = resolveRateLimitPolicies(
      makeEvent("GET", "/api/v1/api-keys"),
      {
        apiKeyId: "ak_1",
        merchantAccountId: "ma_1",
      },
    );

    expect(result.map((x) => x.routeGroup)).toEqual([
      "apiKeys:list",
      "apiKeys:list",
      "apiKeys:list",
    ]);
  });

  it("resolves rotate route policies", () => {
    const result = resolveRateLimitPolicies(
      makeEvent("POST", "/api/v1/api-keys/key_123/rotate"),
      {
        apiKeyId: "ak_1",
        merchantAccountId: "ma_1",
      },
    );

    expect(result[0].routeGroup).toBe("apiKeys:rotate");
  });

  it("returns empty for unrelated route", () => {
    const result = resolveRateLimitPolicies(
      makeEvent("GET", "/api/v1/payments/anything"),
      {
        apiKeyId: "ak_1",
        merchantAccountId: "ma_1",
      },
    );

    expect(result).toEqual([]);
  });
});