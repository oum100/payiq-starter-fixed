import { p as prisma, A as AppError } from '../nitro/nitro.mjs';

async function revokeApiKey(params) {
  const existing = await prisma.apiKey.findFirst({
    where: {
      id: params.apiKeyId,
      tenantId: params.tenantId,
      revokedAt: null
    }
  });
  if (!existing) {
    throw new AppError("API_KEY_NOT_FOUND", "API key not found", 404);
  }
  return prisma.apiKey.update({
    where: { id: existing.id },
    data: {
      revokedAt: /* @__PURE__ */ new Date(),
      status: "DISABLED"
    }
  });
}

export { revokeApiKey as r };
//# sourceMappingURL=revokeApiKey.mjs.map
