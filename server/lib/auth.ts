import type { H3Event } from "h3"
import { getHeader } from "h3"
import { resolveApiKey } from "~/server/services/auth/resolveApiKey"

export async function requireApiKeyAuth(event: H3Event) {
  const apiKey =
    getHeader(event, "x-api-key") ||
    getHeader(event, "authorization")?.replace(/^Bearer\s+/i, "") ||
    ""

  const auth = await resolveApiKey(apiKey)
  event.context.auth = auth
  return auth
}