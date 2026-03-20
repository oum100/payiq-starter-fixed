import { p as prisma, A as AppError, d as defineEventHandler, r as requireApiKeyAuth, g as getRouterParam, s as setResponseStatus } from '../../../../../nitro/nitro.mjs';
import { r as requireScope } from '../../../../../_/requireScope.mjs';
import { r as revokeApiKey } from '../../../../../_/revokeApiKey.mjs';
import { c as createApiKey } from '../../../../../_/createApiKey.mjs';
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

async function rotateApiKey(params) {
  var _a;
  const existing = await prisma.apiKey.findFirst({
    where: {
      id: params.apiKeyId,
      tenantId: params.tenantId,
      revokedAt: null
    },
    include: {
      tenant: true,
      merchantAccount: true
    }
  });
  if (!existing) {
    throw new AppError("API_KEY_NOT_FOUND", "API key not found", 404);
  }
  await revokeApiKey({
    tenantId: params.tenantId,
    apiKeyId: params.apiKeyId
  });
  const rotated = await createApiKey({
    tenantCode: existing.tenant.code,
    merchantCode: (_a = existing.merchantAccount) == null ? void 0 : _a.code,
    name: `${existing.name} (rotated)`,
    scopes: existing.scopes,
    environment: existing.environment,
    expiresAt: existing.expiresAt
  });
  return rotated;
}

const rotate_post = defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "api_keys:manage");
    const id = getRouterParam(event, "id");
    if (!id) {
      setResponseStatus(event, 400);
      return { error: "BAD_REQUEST", message: "Missing API key id" };
    }
    const rotated = await rotateApiKey({
      tenantId: auth.tenantId,
      apiKeyId: id
    });
    return rotated;
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

export { rotate_post as default };
//# sourceMappingURL=rotate.post.mjs.map
