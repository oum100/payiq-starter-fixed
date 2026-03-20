import { d as defineEventHandler, r as requireApiKeyAuth, a as readBody, A as AppError, s as setResponseStatus } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { r as requireScope } from '../../../_/requireScope.mjs';
import { c as createApiKey } from '../../../_/createApiKey.mjs';
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

const schema = z.object({
  name: z.string().min(1),
  scopes: z.array(z.string()).min(1),
  environment: z.enum(["test", "live"]).default("test"),
  expiresAt: z.string().datetime().optional()
});
const index_post = defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "api_keys:manage");
    const body = schema.parse(await readBody(event));
    const created = await createApiKey({
      tenantCode: auth.tenantCode,
      merchantCode: auth.merchantCode || void 0,
      name: body.name,
      scopes: body.scopes,
      environment: body.environment,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
    });
    return created;
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

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
