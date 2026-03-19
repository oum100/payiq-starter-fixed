import { prisma } from "~/server/lib/prisma"
import { AppError } from "~/server/lib/errors"

export async function revokeApiKey(params: {
  tenantId: string
  apiKeyId: string
}) {
  const existing = await prisma.apiKey.findFirst({
    where: {
      id: params.apiKeyId,
      tenantId: params.tenantId,
      revokedAt: null,
    },
  })

  if (!existing) {
    throw new AppError("API_KEY_NOT_FOUND", "API key not found", 404)
  }

  return prisma.apiKey.update({
    where: { id: existing.id },
    data: {
      revokedAt: new Date(),
      status: "DISABLED",
    },
  })
}