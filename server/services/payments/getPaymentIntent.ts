import { prisma } from "~/server/lib/prisma"
import { AppError } from "~/server/lib/errors"
import type { AuthContext } from "~/server/types/auth"

export async function getPaymentIntent(auth: AuthContext, publicId: string) {
  const payment = await prisma.paymentIntent.findFirst({
    where: {
      publicId,
      tenantId: auth.tenantId,
      ...(auth.merchantAccountId
        ? { merchantAccountId: auth.merchantAccountId }
        : {}),
    },
    include: {
      events: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!payment) {
    throw new AppError("PAYMENT_NOT_FOUND", "Payment intent not found", 404)
  }

  return payment
}