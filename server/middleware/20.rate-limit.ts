import {
  createError,
  defineEventHandler,
  setResponseHeader,
} from "h3"
import { resolveRateLimitPolicies } from "~/server/lib/rate-limit/resolve"
import { rateLimitService } from "~/server/lib/rate-limit/service"

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) return

  const policies = resolveRateLimitPolicies(event, {
    apiKeyId: auth.apiKeyId,
    merchantAccountId: auth.merchantAccountId,
  })

  if (!policies.length) return

  let apiKeyLimit = 0
  let apiKeyRemaining = Number.MAX_SAFE_INTEGER
  let apiKeyReset = 0

  for (const policy of policies) {
    const decision = await rateLimitService.check(policy)

    if (policy.scope === "apiKey") {
      apiKeyLimit = policy.capacity
      apiKeyRemaining = Math.min(apiKeyRemaining, decision.remaining)
      apiKeyReset = Math.max(apiKeyReset, decision.resetAfterSec)
    }

    if (!decision.allowed) {
      // public headers: แสดงฝั่ง apiKey เป็นหลักเสมอ
      if (apiKeyLimit > 0) {
        setResponseHeader(event, "X-RateLimit-Limit", String(apiKeyLimit))
        setResponseHeader(
          event,
          "X-RateLimit-Remaining",
          policy.scope === "apiKey" ? "0" : String(Math.max(0, apiKeyRemaining)),
        )
        setResponseHeader(
          event,
          "X-RateLimit-Reset",
          String(Math.max(apiKeyReset, decision.resetAfterSec)),
        )
      }

      setResponseHeader(event, "Retry-After", decision.retryAfterSec)

      console.warn("[rate-limit-deny]", {
        apiKeyId: auth.apiKeyId,
        merchantAccountId: auth.merchantAccountId,
        routeGroup: policy.routeGroup,
        scope: policy.scope,
        retryAfterSec: decision.retryAfterSec,
      })

      throw createError({
        statusCode: 429,
        statusMessage: "Too Many Requests",
        data: {
          code: "RATE_LIMIT_EXCEEDED",
          routeGroup: policy.routeGroup,
          scope: policy.scope,
          retryAfterSec: decision.retryAfterSec,
        },
      })
    }
  }

  if (apiKeyLimit > 0) {
    setResponseHeader(event, "X-RateLimit-Limit", String(apiKeyLimit))
    setResponseHeader(event, "X-RateLimit-Remaining", String(apiKeyRemaining))
    setResponseHeader(event, "X-RateLimit-Reset", String(apiKeyReset))
  }
})