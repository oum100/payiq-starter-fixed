import { d as defineEventHandler, r as requireApiKeyAuth, g as getRouterParam, s as setResponseStatus, A as AppError } from '../../../../../nitro/nitro.mjs';
import { r as requireScope } from '../../../../../_/requireScope.mjs';
import { r as revokeApiKey } from '../../../../../_/revokeApiKey.mjs';
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

const revoke_post = defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "api_keys:manage");
    const id = getRouterParam(event, "id");
    if (!id) {
      setResponseStatus(event, 400);
      return { error: "BAD_REQUEST", message: "Missing API key id" };
    }
    const revoked = await revokeApiKey({
      tenantId: auth.tenantId,
      apiKeyId: id
    });
    return {
      id: revoked.id,
      keyPrefix: revoked.keyPrefix,
      revokedAt: revoked.revokedAt,
      status: revoked.status
    };
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

export { revoke_post as default };
//# sourceMappingURL=revoke.post.mjs.map
