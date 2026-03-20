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
    expect(result.map((x) => x.identifier)).toEqual(["global", "ma_1", "ak_1"]);
    expect(result.map((x) => x.routeGroup)).toEqual([
      "payments:create",
      "payments:create",
      "payments:create",
    ]);

    expect(result[0]).toMatchObject({
      key: "rl:tb:v2:global:global:payments:create",
      windowSec: 60,
      scope: "global",
      identifier: "global",
      routeGroup: "payments:create",
      capacity: 200,
      ttlSec: 60,
      cost: 1,
      blockDurationSec: 0,
    });

    expect(result[1]).toMatchObject({
      key: "rl:tb:v2:tenant:ma_1:payments:create",
      windowSec: 60,
      scope: "tenant",
      identifier: "ma_1",
      routeGroup: "payments:create",
      capacity: 120,
      ttlSec: 60,
      cost: 1,
      blockDurationSec: 0,
    });

    expect(result[2]).toMatchObject({
      key: "rl:tb:v2:apiKey:ak_1:payments:create",
      windowSec: 60,
      scope: "apiKey",
      identifier: "ak_1",
      routeGroup: "payments:create",
      capacity: 60,
      ttlSec: 60,
      cost: 1,
      blockDurationSec: 0,
    });

    expect(result[0]!.refillRatePerSec).toBeCloseTo(200 / 60, 10);
    expect(result[1]!.refillRatePerSec).toBeCloseTo(120 / 60, 10);
    expect(result[2]!.refillRatePerSec).toBeCloseTo(60 / 60, 10);
  });

  it("resolves api-keys list policies", () => {
    const result = resolveRateLimitPolicies(
      makeEvent("GET", "/api/v1/api-keys"),
      {
        apiKeyId: "ak_1",
        merchantAccountId: "ma_1",
      },
    );

    expect(result).toHaveLength(3);
    expect(result.map((x) => x.routeGroup)).toEqual([
      "apiKeys:list",
      "apiKeys:list",
      "apiKeys:list",
    ]);
    expect(result.map((x) => x.key)).toEqual([
      "rl:tb:v2:global:global:apiKeys:list",
      "rl:tb:v2:tenant:ma_1:apiKeys:list",
      "rl:tb:v2:apiKey:ak_1:apiKeys:list",
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

    expect(result).toHaveLength(3);
    expect(result[0]!.routeGroup).toBe("apiKeys:rotate");
    expect(result[2]).toMatchObject({
      scope: "apiKey",
      identifier: "ak_1",
      key: "rl:tb:v2:apiKey:ak_1:apiKeys:rotate",
    });
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

  it("omits tenant and apiKey policies when identifiers are missing", () => {
    const result = resolveRateLimitPolicies(
      makeEvent("POST", "/api/v1/payment-intents"),
      {},
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      scope: "global",
      identifier: "global",
      routeGroup: "payments:create",
      key: "rl:tb:v2:global:global:payments:create",
    });
  });
});
