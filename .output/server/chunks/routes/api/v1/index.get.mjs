import { p as prisma, d as defineEventHandler, r as requireApiKeyAuth, A as AppError, s as setResponseStatus } from '../../../nitro/nitro.mjs';
import { r as requireScope } from '../../../_/requireScope.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';
import 'ioredis';

async function listApiKeys(params) {
  return prisma.apiKey.findMany({
    where: {
      tenantId: params.tenantId,
      ...params.merchantAccountId ? { merchantAccountId: params.merchantAccountId } : {}
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
      updatedAt: true
    }
  });
}

const index_get = defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "api_keys:manage");
    const items = await listApiKeys({
      tenantId: auth.tenantId,
      merchantAccountId: auth.merchantAccountId
    });
    return { items };
  } catch (error) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode);
      return {
        error: error.code,
        message: error.message
      };
    }
    setResponseStatus(event, 400);
    return {
      error: "BAD_REQUEST",
      message: (error == null ? void 0 : error.message) || "Invalid request"
    };
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
