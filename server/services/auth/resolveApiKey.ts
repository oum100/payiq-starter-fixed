import { prisma } from "~/server/lib/prisma";
import { AppError } from "~/server/lib/errors";
import type { AuthContext } from "~/server/types/auth";
import { splitFullApiKey, verifyApiKeySecret } from "~/server/lib/apiKeyCrypto";

export async function resolveApiKey(fullApiKey: string): Promise<AuthContext> {
  if (!fullApiKey) {
    throw new AppError("UNAUTHORIZED", "Missing API key", 401);
  }

  const parsed = splitFullApiKey(fullApiKey);
  if (!parsed) {
    throw new AppError("UNAUTHORIZED", "Malformed API key", 401);
  }

  const record = await prisma.apiKey.findFirst({
    where: {
      keyPrefix: parsed.keyPrefix,
      status: "ACTIVE",
      revokedAt: null,
    },
    include: {
      tenant: true,
      merchantAccount: true,
    },
  });

  if (!record) {
    throw new AppError("UNAUTHORIZED", "Invalid API key", 401);
  }

  const valid = verifyApiKeySecret(parsed.secret, record.secretHash);
  if (!valid) {
    throw new AppError("UNAUTHORIZED", "Invalid API key", 401);
  }

  if (record.expiresAt && record.expiresAt.getTime() < Date.now()) {
    throw new AppError("UNAUTHORIZED", "API key expired", 401);
  }

  if (record.tenant.status !== "ACTIVE") {
    throw new AppError("FORBIDDEN", "Tenant is inactive", 403);
  }

  if (record.merchantAccountId && record.merchantAccount?.status !== "ACTIVE") {
    throw new AppError("FORBIDDEN", "Merchant is inactive", 403);
  }

  await prisma.apiKey.update({
    where: { id: record.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    apiKeyId: record.id,
    apiKeyPrefix: record.keyPrefix,
    tenantId: record.tenantId,
    tenantCode: record.tenant.code,
    merchantAccountId: record.merchantAccountId || null,
    merchantCode: record.merchantAccount?.code || null,
    scopes: record.scopes,
  };
}