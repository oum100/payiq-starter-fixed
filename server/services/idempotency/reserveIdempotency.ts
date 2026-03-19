import { prisma } from "~/server/lib/prisma"
import { AppError } from "~/server/lib/errors"
import { sha256 } from "~/server/lib/crypto"

export async function reserveIdempotency(params: {
  tenantId: string
  key?: string | null
  requestPath: string
  requestMethod: string
  requestBody: unknown
}) {
  if (!params.key) return null

  const requestHash = sha256(JSON.stringify(params.requestBody ?? {}))

  const existing = await prisma.idempotencyKey.findUnique({
    where: { tenantId_key: { tenantId: params.tenantId, key: params.key } },
  })

  if (existing) {
    if (existing.requestHash !== requestHash) {
      throw new AppError("IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD", "Idempotency key already used with different payload", 409)
    }
    return existing
  }

  return prisma.idempotencyKey.create({
    data: {
      tenantId: params.tenantId,
      key: params.key,
      requestPath: params.requestPath,
      requestMethod: params.requestMethod,
      requestHash,
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })
}
