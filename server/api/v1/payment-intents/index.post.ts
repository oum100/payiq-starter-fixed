import { z } from "zod"
import { createPaymentIntent } from "~/server/services/payments/createPaymentIntent"
import { AppError } from "~/server/lib/errors"
import { requireApiKeyAuth } from "~/server/lib/auth"
import { requireScope } from "~/server/services/auth/requireScope"

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
})

export default defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event)
    requireScope(auth, "payments:create")

    const body = schema.parse(await readBody(event))
    const idempotencyKey = getHeader(event, "idempotency-key")

    const result = await createPaymentIntent(auth, body, {
      idempotencyKey,
    })

    return result
  } catch (error: any) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode)
      return {
        error: error.code,
        message: error.message,
        details: error.details,
      }
    }

    setResponseStatus(event, 400)
    return {
      error: "BAD_REQUEST",
      message: error?.message || "Invalid request",
    }
  }
})