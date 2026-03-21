import { beforeEach, afterAll, describe, expect, it, mock } from "bun:test";

mock.restore();

const checkMock = mock();

mock.module("~/server/lib/rate-limit/service", () => ({
  rateLimitService: {
    check: checkMock,
  },
}));

const handler = (await import("~/server/middleware/20.rate-limit")).default;

function makeEvent() {
  const headers: Record<string, string> = {};

  return {
    method: "POST",
    path: "/api/v1/payment-intents",
    context: {
      auth: {
        apiKeyId: "ak_1",
        merchantAccountId: "ma_1",
      },
    },
    node: {
      req: {
        method: "POST",
        url: "/api/v1/payment-intents",
      },
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

  afterAll(() => {
    mock.restore();
  });

  it("sets X-RateLimit headers when allowed", async () => {
    checkMock
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 199,
        retryAfterSec: 0,
        resetAfterSec: 60,
        blocked: false,
        blockRemainingSec: 0,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 119,
        retryAfterSec: 0,
        resetAfterSec: 60,
        blocked: false,
        blockRemainingSec: 0,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 59,
        retryAfterSec: 0,
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
        retryAfterSec: 0,
        resetAfterSec: 60,
        blocked: false,
        blockRemainingSec: 0,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 119,
        retryAfterSec: 0,
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
      code: "RATE_LIMIT_EXCEEDED",
      statusCode: 429,
      message: "Too Many Requests",
      details: {
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
