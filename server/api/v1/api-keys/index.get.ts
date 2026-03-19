import { requireApiKeyAuth } from "~/server/lib/auth"
import { requireScope } from "~/server/services/auth/requireScope"
import { listApiKeys } from "~/server/services/auth/listApiKeys"
import { AppError } from "~/server/lib/errors"

export default defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event)
    requireScope(auth, "api_keys:manage")

    const items = await listApiKeys({
      tenantId: auth.tenantId,
      merchantAccountId: auth.merchantAccountId,
    })

    return { items }
  } catch (error: any) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode)
      return {
        error: error.code,
        message: error.message,
      }
    }

    setResponseStatus(event, 400)
    return {
      error: "BAD_REQUEST",
      message: error?.message || "Invalid request",
    }
  }
})