import {
  createError,
  defineEventHandler,
  setResponseHeader,
} from "h3"
import { requireApiKeyAuth } from "~/server/lib/auth"
import { getClientIpHash } from "~/server/lib/rate-limit/request"
import { rateLimitService } from "~/server/lib/rate-limit/service"
import { ROUTE_LIMITS } from "~/server/lib/rate-limit/config"
import type { ResolvedRateLimitPolicy } from "~/server/lib/rate-limit/types"

function isProtectedPath(path: string) {
  if (path === "/api/v1/health") return false
  return path.startsWith("/api/v1/")
}

function buildAuthPolicy(
  routeGroup: "auth:malformed" | "auth:unknown" | "auth:failed",
  ipHash: string,
): ResolvedRateLimitPolicy {
  const base = ROUTE_LIMITS[routeGroup]

  return {
    scope: "ip",
    identifier: ipHash,
    routeGroup,
    capacity: base.capacity,
    refillRatePerSec: base.refillRatePerSec,
    cost: base.cost ?? 1,
    ttlSec: base.ttlSec ?? 3600,
    blockDurationSec: base.blockDurationSec ?? 0,
  }
}

async function denyWithAbuseControl(
  event: Parameters<typeof defineEventHandler>[0] extends (e: infer E) => any ? E : never,
  routeGroup: "auth:malformed" | "auth:unknown" | "auth:failed",
  message: string,
) {
  const ipHash = getClientIpHash(event)
  const decision = await rateLimitService.check(buildAuthPolicy(routeGroup, ipHash))

  if (!decision.allowed) {
    setResponseHeader(event, "Retry-After", String(decision.retryAfterSec))

    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "AUTH_RATE_LIMITED",
        routeGroup,
        retryAfterSec: decision.retryAfterSec,
      },
    })
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
    data: {
      code: message,
    },
  })
}

export default defineEventHandler(async (event) => {
  if (!isProtectedPath(event.path)) return

  try {
    await requireApiKeyAuth(event)
  } catch (error: any) {
    const message = String(error?.message || "")

    if (message.includes("Malformed API key")) {
      await denyWithAbuseControl(event, "auth:malformed", "MALFORMED_API_KEY")
    }

    if (
      message.includes("Invalid API key prefix") ||
      message.includes("API key not found") ||
      message.includes("Unknown API key")
    ) {
      await denyWithAbuseControl(event, "auth:unknown", "INVALID_API_KEY")
    }

    if (
      message.includes("Invalid API key secret") ||
      message.includes("Invalid API key") ||
      message.includes("Unauthorized")
    ) {
      await denyWithAbuseControl(event, "auth:failed", "INVALID_API_KEY")
    }

    throw error
  }
})