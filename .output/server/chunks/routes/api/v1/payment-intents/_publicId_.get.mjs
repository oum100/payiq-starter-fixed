import { p as prisma, A as AppError, d as defineEventHandler, r as requireApiKeyAuth, g as getRouterParam, s as setResponseStatus } from '../../../../nitro/nitro.mjs';
import { r as requireScope } from '../../../../_/requireScope.mjs';
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

async function getPaymentIntent(auth, publicId) {
  const payment = await prisma.paymentIntent.findFirst({
    where: {
      publicId,
      tenantId: auth.tenantId,
      ...auth.merchantAccountId ? { merchantAccountId: auth.merchantAccountId } : {}
    },
    include: {
      events: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
  if (!payment) {
    throw new AppError("PAYMENT_NOT_FOUND", "Payment intent not found", 404);
  }
  return payment;
}

const _publicId__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "payments:read");
    const publicId = getRouterParam(event, "publicId");
    const payment = await getPaymentIntent(auth, publicId);
    return {
      publicId: payment.publicId,
      status: payment.status,
      amount: payment.amount.toString(),
      currency: payment.currency,
      merchantOrderId: payment.merchantOrderId,
      merchantReference: payment.merchantReference,
      providerReference: payment.providerReference,
      providerTransactionId: payment.providerTransactionId,
      qrPayload: payment.qrPayload,
      deeplinkUrl: payment.deeplinkUrl,
      redirectUrl: payment.redirectUrl,
      expiresAt: ((_a = payment.expiresAt) == null ? void 0 : _a.toISOString()) || null,
      events: payment.events.map((e) => ({
        type: e.type,
        fromStatus: e.fromStatus,
        toStatus: e.toStatus,
        summary: e.summary,
        createdAt: e.createdAt.toISOString()
      }))
    };
  } catch (error) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode);
      return { error: error.code, message: error.message };
    }
    setResponseStatus(event, 400);
    return { error: "BAD_REQUEST", message: (error == null ? void 0 : error.message) || "Invalid request" };
  }
});

export { _publicId__get as default };
//# sourceMappingURL=_publicId_.get.mjs.map
