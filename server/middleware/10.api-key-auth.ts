import {
  createError,
  defineEventHandler,
  setResponseHeader,
  type H3Event,
} from "h3";
import { requireApiKeyAuth } from "~/server/lib/auth";
import { getClientIpHash } from "~/server/lib/rate-limit/request";
import { rateLimitService } from "~/server/lib/rate-limit/service";
import { ROUTE_LIMITS } from "~/server/lib/rate-limit/config";
import {
  toCheckPolicyInput,
  type CheckPolicyInput,
  type RateLimitDecision,
} from "~/server/lib/rate-limit/types";

type AuthAbuseRouteGroup = "auth:malformed" | "auth:unknown" | "auth:failed";

function isProtectedPath(path: string) {
  if (path === "/api/v1/health") return false;
  return path.startsWith("/api/v1/");
}

function buildAuthCheckInput(
  routeGroup: AuthAbuseRouteGroup,
  ipHash: string,
): CheckPolicyInput {
  const base = ROUTE_LIMITS[routeGroup];

  // return toCheckPolicyInput(
  //   routeGroup,
  //   "ip",
  //   { identifier: ipHash },
  //   {
  //     capacity: base.capacity,
  //     refillRatePerSec: base.refillRatePerSec,
  //     cost: base.cost,
  //     ttlSec: base.ttlSec,
  //     blockDurationSec: base.blockDurationSec,
  //   },
  // );
  return toCheckPolicyInput(
    routeGroup,
    "ip",
    { identifier: ipHash },
    {
      capacity: base.capacity,
      refillRatePerSec: base.refillRatePerSec,
      ...(base.cost !== undefined && { cost: base.cost }),
      ...(base.ttlSec !== undefined && { ttlSec: base.ttlSec }),
      ...(base.blockDurationSec !== undefined && {
        blockDurationSec: base.blockDurationSec,
      }),
    },
  );
}

async function denyWithAbuseControl(
  event: H3Event,
  routeGroup: AuthAbuseRouteGroup,
  message: string,
) {
  const ipHash = getClientIpHash(event);

  const decision: RateLimitDecision = await rateLimitService.check(
    buildAuthCheckInput(routeGroup, ipHash),
  );

  if (!decision.allowed) {
    setResponseHeader(event, "Retry-After", decision.retryAfterSec);

    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "AUTH_RATE_LIMITED",
        routeGroup,
        retryAfterSec: decision.retryAfterSec,
        blocked: decision.blocked,
        blockRemainingSec: decision.blockRemainingSec,
        resetAfterSec: decision.resetAfterSec,
      },
    });
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
    data: {
      code: message,
    },
  });
}

export default defineEventHandler(async (event) => {
  if (!isProtectedPath(event.path)) return;

  try {
    await requireApiKeyAuth(event);
  } catch (error: unknown) {
    const message = String(
      error instanceof Error ? error.message : (error ?? ""),
    );

    if (message.includes("Malformed API key")) {
      await denyWithAbuseControl(event, "auth:malformed", "MALFORMED_API_KEY");
    }

    if (
      message.includes("Invalid API key prefix") ||
      message.includes("API key not found") ||
      message.includes("Unknown API key")
    ) {
      await denyWithAbuseControl(event, "auth:unknown", "INVALID_API_KEY");
    }

    if (
      message.includes("Invalid API key secret") ||
      message.includes("Invalid API key") ||
      message.includes("Unauthorized")
    ) {
      await denyWithAbuseControl(event, "auth:failed", "INVALID_API_KEY");
    }

    throw error;
  }
});
