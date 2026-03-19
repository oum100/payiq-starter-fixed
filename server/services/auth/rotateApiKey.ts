import { prisma } from "~/server/lib/prisma"
import { AppError } from "~/server/lib/errors"
import { revokeApiKey } from "./revokeApiKey"
import { createApiKey } from "./createApiKey"

export async function rotateApiKey(params: {
  tenantId: string
  apiKeyId: string
}) {
  const existing = await prisma.apiKey.findFirst({
    where: {
      id: params.apiKeyId,
      tenantId: params.tenantId,
      revokedAt: null,
    },
    include: {
      tenant: true,
      merchantAccount: true,
    },
  })

  if (!existing) {
    throw new AppError("API_KEY_NOT_FOUND", "API key not found", 404)
  }

  await revokeApiKey({
    tenantId: params.tenantId,
    apiKeyId: params.apiKeyId,
  })

  const rotated = await createApiKey({
    tenantCode: existing.tenant.code,
    merchantCode: existing.merchantAccount?.code,
    name: `${existing.name} (rotated)`,
    scopes: existing.scopes,
    environment: existing.environment as "test" | "live",
    expiresAt: existing.expiresAt,
  })

  return rotated
}