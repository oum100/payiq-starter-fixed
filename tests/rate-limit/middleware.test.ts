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
      routeGroup: "payments:create",
      scope: "global",
      capacity: 200,
      windowSec: 60,
      key: "ratelimit:payments:create:global",
    },
    {
      routeGroup: "payments:create",
      scope: "tenant",
      capacity: 120,
      windowSec: 60,
      key: "ratelimit:payments:create:tenant:ma_1",
    },
    {
      routeGroup: "payments:create",
      scope: "apiKey",
      capacity: 60,
      windowSec: 60,
      key: "ratelimit:payments:create:apiKey:ak_1",
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
        setHeader: (name: string, value: string) => {
          headers[name] = value;
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
        retryAfterSec: "60",
        resetAfterSec: 60,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 119,
        retryAfterSec: "60",
        resetAfterSec: 60,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 59,
        retryAfterSec: "60",
        resetAfterSec: 60,
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
        retryAfterSec: "60",
        resetAfterSec: 60,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 119,
        retryAfterSec: "60",
        resetAfterSec: 60,
      })
      .mockResolvedValueOnce({
        allowed: false,
        remaining: 0,
        retryAfterSec: "30",
        resetAfterSec: 30,
      });

    const event = makeEvent();

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 429,
      statusMessage: "Too Many Requests",
    });

    expect(event.__headers["Retry-After"]).toBe("30");
    expect(event.__headers["X-RateLimit-Limit"]).toBe("60");
    expect(event.__headers["X-RateLimit-Remaining"]).toBe("0");
    expect(event.__headers["X-RateLimit-Reset"]).toBe("30");
  });
});