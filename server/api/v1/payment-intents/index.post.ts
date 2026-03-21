import { z } from "zod";
import { createPaymentIntent } from "~/server/services/payments/createPaymentIntent";
import { AppError } from "~/server/lib/errors";
import { requireScope } from "~/server/services/auth/requireScope";
import { checkPaymentSpamOrThrow } from "~/server/lib/rate-limit/payment-spam";
import { requireApiKeyAuth } from "~/server/lib/auth";
import type { CreatePaymentIntentInput } from "~/server/types/payment";

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
    const headerIdempotencyKey = getHeader(event, "idempotency-key");
    const idempotencyKey = headerIdempotencyKey ?? null;
    const merchantAccountId = getMerchantAccountId(auth);

    if (merchantAccountId) {
      await checkPaymentSpamOrThrow(event, {
        merchantAccountId,
        amount: body.amount,
        currency: body.currency,
        reference:
          body.merchantReference ??
          body.merchantOrderId ??
          idempotencyKey ??
          null,
      });
    }

    const input: CreatePaymentIntentInput = {
      amount: body.amount,
      currency: body.currency,
      paymentMethodType: body.paymentMethodType,
      ...(body.merchantOrderId !== undefined && {
        merchantOrderId: body.merchantOrderId,
      }),
      ...(body.merchantReference !== undefined && {
        merchantReference: body.merchantReference,
      }),
      ...(body.customerName !== undefined && {
        customerName: body.customerName,
      }),
      ...(body.customerEmail !== undefined && {
        customerEmail: body.customerEmail,
      }),
      ...(body.customerPhone !== undefined && {
        customerPhone: body.customerPhone,
      }),
      ...(body.metadata !== undefined && {
        metadata: body.metadata,
      }),
    };

    const result = await createPaymentIntent(auth, input, {
      idempotencyKey,
      event,
    });

    return result;
  } catch (error: any) {
    if (error instanceof AppError) {
      const retryAfterSec = (error.details as any)?.retryAfterSec;

      if (typeof retryAfterSec === "number") {
        setResponseHeader(event, "Retry-After", retryAfterSec);
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
