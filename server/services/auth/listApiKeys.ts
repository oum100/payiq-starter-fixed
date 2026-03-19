import { prisma } from "~/server/lib/prisma"

export async function listApiKeys(params: {
  tenantId: string
  merchantAccountId?: string | null
}) {
  return prisma.apiKey.findMany({
    where: {
      tenantId: params.tenantId,
      ...(params.merchantAccountId
        ? { merchantAccountId: params.merchantAccountId }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      keyPrefix: true,
      name: true,
      status: true,
      environment: true,
      scopes: true,
      lastUsedAt: true,
      expiresAt: true,
      revokedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}