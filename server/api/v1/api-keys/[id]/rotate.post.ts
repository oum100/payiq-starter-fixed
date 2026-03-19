import { requireApiKeyAuth } from "~/server/lib/auth"
import { requireScope } from "~/server/services/auth/requireScope"
import { rotateApiKey } from "~/server/services/auth/rotateApiKey"
import { AppError } from "~/server/lib/errors"

export default defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event)
    requireScope(auth, "api_keys:manage")

    const id = getRouterParam(event, "id")
    if (!id) {
      setResponseStatus(event, 400)
      return { error: "BAD_REQUEST", message: "Missing API key id" }
    }

    const rotated = await rotateApiKey({
      tenantId: auth.tenantId,
      apiKeyId: id,
    })

    return rotated
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