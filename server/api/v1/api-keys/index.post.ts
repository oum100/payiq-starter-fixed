import { z } from "zod"
import { requireApiKeyAuth } from "~/server/lib/auth"
import { requireScope } from "~/server/services/auth/requireScope"
import { createApiKey } from "~/server/services/auth/createApiKey"
import { AppError } from "~/server/lib/errors"

const schema = z.object({
  name: z.string().min(1),
  scopes: z.array(z.string()).min(1),
  environment: z.enum(["test", "live"]).default("test"),
  expiresAt: z.string().datetime().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event)
    requireScope(auth, "api_keys:manage")

    const body = schema.parse(await readBody(event))

    const created = await createApiKey({
      tenantCode: auth.tenantCode,
      merchantCode: auth.merchantCode || undefined,
      name: body.name,
      scopes: body.scopes,
      environment: body.environment,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    })

    return created
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