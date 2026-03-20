import { p as prisma, A as AppError, b as generateKeyPrefix, c as generateApiKeySecret, h as hashApiKeySecret, e as buildFullApiKey } from '../nitro/nitro.mjs';

async function createApiKey(params) {
  const tenant = await prisma.tenant.findUnique({
    where: { code: params.tenantCode }
  });
  if (!tenant) {
    throw new AppError("TENANT_NOT_FOUND", "Tenant not found", 404);
  }
  const merchant = params.merchantCode ? await prisma.merchantAccount.findFirst({
    where: {
      tenantId: tenant.id,
      code: params.merchantCode
    }
  }) : null;
  if (params.merchantCode && !merchant) {
    throw new AppError("MERCHANT_NOT_FOUND", "Merchant not found", 404);
  }
  const keyPrefix = generateKeyPrefix(params.environment || "test");
  const secret = generateApiKeySecret();
  const secretHash = hashApiKeySecret(secret);
  const created = await prisma.apiKey.create({
    data: {
      tenantId: tenant.id,
      merchantAccountId: (merchant == null ? void 0 : merchant.id) || null,
      keyPrefix,
      secretHash,
      name: params.name,
      status: "ACTIVE",
      scopes: params.scopes,
      environment: params.environment || "test",
      expiresAt: params.expiresAt || null
    }
  });
  return {
    id: created.id,
    keyPrefix: created.keyPrefix,
    fullKey: buildFullApiKey(keyPrefix, secret),
    environment: created.environment,
    scopes: created.scopes,
    expiresAt: created.expiresAt,
    createdAt: created.createdAt
  };
}

export { createApiKey as c };
//# sourceMappingURL=createApiKey.mjs.map
