import { beforeEach, describe, expect, it, mock } from "bun:test";

const checkMock = mock();

mock.module("~/server/lib/rate-limit/service", () => ({
  rateLimitService: {
    check: checkMock,
  },
}));

mock.module("~/server/lib/rate-limit/resolve", () => ({
  resolveRateLimitPolicies: mock(() => [
    {
      key: "rl:tb:v2:global:global:payments:create",
      windowSec: 60,
      scope: "global",
      identifier: "global",
      routeGroup: "payments:create",
      capacity: 200,
      refillRatePerSec: 200 / 60,
      cost: 1,
      ttlSec: 60,
      blockDurationSec: 0,
    },
    {
      key: "rl:tb:v2:tenant:ma_1:payments:create",
      windowSec: 60,
      scope: "tenant",
      identifier: "ma_1",
      routeGroup: "payments:create",
      capacity: 120,
      refillRatePerSec: 120 / 60,
      cost: 1,
      ttlSec: 60,
      blockDurationSec: 0,
    },
    {
      key: "rl:tb:v2:apiKey:ak_1:payments:create",
      windowSec: 60,
      scope: "apiKey",
      identifier: "ak_1",
      routeGroup: "payments:create",
      capacity: 60,
      refillRatePerSec: 60 / 60,
      cost: 1,
      ttlSec: 60,
      blockDurationSec: 0,
    },
  ]),
}));

const handler = (await import("~/server/middleware/20.rate-limit")).default;

function makeEvent() {
  const headers: Record<string, string> = {};

  return {
    context: {
      auth: {
        apiKeyId: "ak_1",
        merchantAccountId: "ma_1",
      },
    },
    node: {
      res: {
        setHeader: (name: string, value: string | number) => {
          headers[name] = String(value);
        },
      },
    },
    __headers: headers,
  } as any;
}

describe("20.rate-limit middleware", () => {
  beforeEach(() => {
    checkMock.mockReset();
  });

  it("sets X-RateLimit headers when allowed", async () => {
    checkMock
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 199,
        retryAfterSec: 60,
        resetAfterSec: 60,
        blocked: false,
        blockRemainingSec: 0,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 119,
        retryAfterSec: 60,
        resetAfterSec: 60,
        blocked: false,
        blockRemainingSec: 0,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 59,
        retryAfterSec: 60,
        resetAfterSec: 60,
        blocked: false,
        blockRemainingSec: 0,
      });

    const event = makeEvent();

    await handler(event);

    expect(event.__headers["X-RateLimit-Limit"]).toBe("60");
    expect(event.__headers["X-RateLimit-Remaining"]).toBe("59");
    expect(event.__headers["X-RateLimit-Reset"]).toBe("60");
  });

  it("throws 429 and sets Retry-After when denied", async () => {
    checkMock
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 199,
        retryAfterSec: 60,
        resetAfterSec: 60,
        blocked: false,
        blockRemainingSec: 0,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 119,
        retryAfterSec: 60,
        resetAfterSec: 60,
        blocked: false,
        blockRemainingSec: 0,
      })
      .mockResolvedValueOnce({
        allowed: false,
        remaining: 0,
        retryAfterSec: 30,
        resetAfterSec: 30,
        blocked: true,
        blockRemainingSec: 30,
      });

    const event = makeEvent();

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "RATE_LIMIT_EXCEEDED",
        routeGroup: "payments:create",
        scope: "apiKey",
        retryAfterSec: 30,
        blocked: true,
        blockRemainingSec: 30,
      },
    });

    expect(event.__headers["Retry-After"]).toBe("30");
    expect(event.__headers["X-RateLimit-Limit"]).toBe("60");
    expect(event.__headers["X-RateLimit-Remaining"]).toBe("0");
    expect(event.__headers["X-RateLimit-Reset"]).toBe("30");
  });
});