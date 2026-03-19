import { getPaymentIntent } from "~/server/services/payments/getPaymentIntent"
import { AppError } from "~/server/lib/errors"
import { requireApiKeyAuth } from "~/server/lib/auth"
import { requireScope } from "~/server/services/auth/requireScope"

export default defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event)
    requireScope(auth, "payments:read")

    const publicId = getRouterParam(event, "publicId")!
    const payment = await getPaymentIntent(auth, publicId)

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
      expiresAt: payment.expiresAt?.toISOString() || null,
      events: payment.events.map((e) => ({
        type: e.type,
        fromStatus: e.fromStatus,
        toStatus: e.toStatus,
        summary: e.summary,
        createdAt: e.createdAt.toISOString(),
      })),
    }
  } catch (error: any) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode)
      return { error: error.code, message: error.message }
    }

    setResponseStatus(event, 400)
    return { error: "BAD_REQUEST", message: error?.message || "Invalid request" }
  }
})