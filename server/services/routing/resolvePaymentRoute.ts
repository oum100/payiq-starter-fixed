import { prisma } from "~/server/lib/prisma"
import { AppError } from "~/server/lib/errors"

export async function resolvePaymentRoute(params: {
  tenantId: string
  paymentMethodType: "PROMPTPAY_QR"
  currency: "THB"
}) {
  const route = await prisma.paymentRoute.findFirst({
    where: {
      tenantId: params.tenantId,
      paymentMethodType: params.paymentMethodType,
      currency: params.currency,
      status: "ACTIVE",
    },
    include: {
      billerProfile: true,
    },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  })

  if (!route) throw new AppError("ROUTE_NOT_FOUND", "No active payment route found", 422)
  if (route.billerProfile.status !== "ACTIVE") throw new AppError("BILLER_INACTIVE", "Resolved biller is inactive", 422)

  return route
}
