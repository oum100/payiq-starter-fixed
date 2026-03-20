import { z } from "zod";
import { createPaymentIntent } from "~/server/services/payments/createPaymentIntent";
import { AppError } from "~/server/lib/errors";
import { requireScope } from "~/server/services/auth/requireScope";
import { checkPaymentSpamOrThrow } from "~/server/lib/rate-limit/payment-spam";
import { requireApiKeyAuth } from "~/server/lib/auth";

const schema = z.object({
  merchantOrderId: z.string().optional(),
  merchantReference: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.literal("THB").default("THB"),
  paymentMethodType: z.literal("PROMPTPAY_QR"),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  customerPhone: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

function getApiKeyId(auth: any): string | null {
  return auth?.apiKeyId ?? auth?.apiKey?.id ?? auth?.id ?? null;
}

function getMerchantAccountId(auth: any): string | null {
  return (
    auth?.merchantAccountId ??
    auth?.merchantAccount?.id ??
    auth?.apiKey?.merchantAccountId ??
    null
  );
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "payments:create");

    const body = schema.parse(await readBody(event));
    const idempotencyKey = getHeader(event, "idempotency-key");

    const apiKeyId = getApiKeyId(auth);
    const merchantAccountId = getMerchantAccountId(auth);

    if (apiKeyId && merchantAccountId) {
      await checkPaymentSpamOrThrow(event, {
        merchantAccountId,
        apiKeyId,
        amount: body.amount,
        currency: body.currency,
        reference:
          body.merchantReference ??
          body.merchantOrderId ??
          idempotencyKey ??
          null,
      });
    }

    const result = await createPaymentIntent(auth, body, {
      idempotencyKey,
      event,
    });

    return result;
  } catch (error: any) {
    if (error instanceof AppError) {
      if ((error.details as any)?.retryAfterSec) {
        setResponseHeader(
          event,
          "Retry-After",
          (error.details as any).retryAfterSec.toString(),
        );
      }

      setResponseStatus(event, error.statusCode);
      return {
        error: error.code,
        message: error.message,
        details: error.details,
      };
    }

    if (error?.statusCode) {
      setResponseStatus(event, error.statusCode);
      return {
        error: error?.data?.code || "REQUEST_ERROR",
        message: error?.statusMessage || error?.message || "Request failed",
        details: error?.data,
      };
    }

    setResponseStatus(event, 400);
    return {
      error: "BAD_REQUEST",
      message: error?.message || "Invalid request",
    };
  }
});
