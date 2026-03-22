import { defineEventHandler } from "h3"
import { AppError } from "~/server/lib/errors"
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
      if (apiKeyLimit > 0) {
        event.node.res.setHeader("X-RateLimit-Limit", String(apiKeyLimit))
        event.node.res.setHeader(
          "X-RateLimit-Remaining",
          policy.scope === "apiKey"
            ? "0"
            : String(Math.max(0, apiKeyRemaining)),
        )
        event.node.res.setHeader(
          "X-RateLimit-Reset",
          String(Math.max(apiKeyReset, decision.resetAfterSec)),
        )
      }

      event.node.res.setHeader("Retry-After", String(decision.retryAfterSec))

      console.warn("[rate-limit-deny]", {
        apiKeyId: auth.apiKeyId,
        merchantAccountId: auth.merchantAccountId,
        routeGroup: policy.routeGroup,
        scope: policy.scope,
        retryAfterSec: decision.retryAfterSec,
        blocked: decision.blocked,
      })

      throw new AppError("RATE_LIMIT_EXCEEDED", "Too Many Requests", 429, {
        routeGroup: policy.routeGroup,
        scope: policy.scope,
        retryAfterSec: decision.retryAfterSec,
        blocked: decision.blocked,
        blockRemainingSec: decision.blockRemainingSec,
      })
    }
  }

  if (apiKeyLimit > 0) {
    event.node.res.setHeader("X-RateLimit-Limit", String(apiKeyLimit))
    event.node.res.setHeader("X-RateLimit-Remaining", String(apiKeyRemaining))
    event.node.res.setHeader("X-RateLimit-Reset", String(apiKeyReset))
  }
})