import { prisma } from "~/server/lib/prisma";
import { AppError } from "~/server/lib/errors";
import { revokeApiKey } from "./revokeApiKey";
import { createApiKey } from "./createApiKey";

export async function rotateApiKey(params: {
  tenantId: string;
  apiKeyId: string;
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
  });

  if (!existing) {
    throw new AppError("API_KEY_NOT_FOUND", "API key not found", 404);
  }

  await revokeApiKey({
    tenantId: params.tenantId,
    apiKeyId: params.apiKeyId,
  });

  const merchantCode = existing.merchantAccount?.code;

  if (existing.environment !== "test" && existing.environment !== "live") {
    throw new Error(`Unsupported api key environment: ${existing.environment}`);
  }

  const rotated = await createApiKey({
    tenantCode: existing.tenant.code,
    name: existing.name,
    scopes: existing.scopes,
    environment: existing.environment,

    ...(existing.expiresAt !== undefined && {
      expiresAt: existing.expiresAt,
    }),

    ...(merchantCode !== undefined && {
      merchantCode,
    }),
  });

  return rotated;
}
