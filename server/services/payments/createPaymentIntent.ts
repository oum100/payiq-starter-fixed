import { nanoid } from "nanoid";
import { prisma } from "~/server/lib/prisma";
import { AppError } from "~/server/lib/errors";
import { resolvePaymentRoute } from "../routing/resolvePaymentRoute";
import { reserveIdempotency } from "../idempotency/reserveIdempotency";
import { getProviderAdapter } from "../providers/registry";
import type {
  CreatePaymentIntentInput,
  CreatePaymentIntentResult,
} from "~/server/types/payment";
import type { AuthContext } from "~/server/types/auth";

export async function createPaymentIntent(
  auth: AuthContext,
  input: CreatePaymentIntentInput,
  opts?: { idempotencyKey?: string | null },
): Promise<CreatePaymentIntentResult> {
  if (!auth.merchantAccountId) {
    throw new AppError(
      "FORBIDDEN",
      "API key is not bound to a merchant account",
      403,
    );
  }

  const merchant = await prisma.merchantAccount.findFirst({
    where: {
      id: auth.merchantAccountId,
      tenantId: auth.tenantId,
      status: "ACTIVE",
    },
  });

  if (!merchant) {
    throw new AppError(
      "MERCHANT_NOT_FOUND",
      "Merchant not found or inactive",
      404,
    );
  }

  const existingMerchantOrder = input.merchantOrderId
    ? await prisma.paymentIntent.findFirst({
        where: {
          tenantId: auth.tenantId,
          merchantAccountId: merchant.id,
          merchantOrderId: input.merchantOrderId,
        },
      })
    : null;

  if (existingMerchantOrder) {
    return {
      publicId: existingMerchantOrder.publicId,
      status: existingMerchantOrder.status,
      amount: existingMerchantOrder.amount.toString(),
      currency: existingMerchantOrder.currency,
      qrPayload: existingMerchantOrder.qrPayload,
      deeplinkUrl: existingMerchantOrder.deeplinkUrl,
      redirectUrl: existingMerchantOrder.redirectUrl,
      expiresAt: existingMerchantOrder.expiresAt?.toISOString() || null,
    };
  }

  const idem = await reserveIdempotency({
    tenantId: auth.tenantId,
    key: opts?.idempotencyKey,
    requestPath: "/api/v1/payment-intents",
    requestMethod: "POST",
    requestBody: input,
  });

  if (idem?.resourceId && idem.responseBody) {
    return idem.responseBody as unknown as CreatePaymentIntentResult;
  }

  const route = await resolvePaymentRoute({
    tenantId: auth.tenantId,
    paymentMethodType: "PROMPTPAY_QR",
    currency: "THB",
  });

  const publicId = `piq_${nanoid(24)}`;
  const callbackUrl = `${process.env.APP_BASE_URL}/api/v1/providers/scb/callback`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const created = await prisma.paymentIntent.create({
    data: {
      tenantId: auth.tenantId,
      merchantAccountId: merchant.id,
      paymentRouteId: route.id,
      billerProfileId: route.billerProfile.id,
      publicId,
      merchantOrderId: input.merchantOrderId,
      merchantReference: input.merchantReference,
      idempotencyKeyValue: opts?.idempotencyKey || null,
      paymentMethodType: "PROMPTPAY_QR",
      providerCode: route.providerCode,
      currency: "THB",
      amount: input.amount,
      feeAmount: "0",
      netAmount: input.amount,
      status: "PENDING_PROVIDER",
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      metadata: input.metadata as any,
      expiresAt,
      events: {
        create: [
          {
            type: "PAYMENT_CREATED",
            toStatus: "CREATED",
            summary: "Payment intent created",
          },
          {
            type: "ROUTE_RESOLVED",
            fromStatus: "CREATED",
            toStatus: "ROUTING",
            summary: "Route resolved",
            payload: {
              routeId: route.id,
              billerProfileId: route.billerProfile.id,
              providerCode: route.providerCode,
            },
          },
        ],
      },
    },
  });

  const provider = getProviderAdapter(route.providerCode);

  const providerResult = await provider.createPayment({
    paymentIntentId: created.id,
    publicId: created.publicId,
    amount: created.amount.toString(),
    currency: created.currency,
    merchantOrderId: created.merchantOrderId,
    expiresAt: created.expiresAt?.toISOString() || null,
    callbackUrl,
    billerProfile: {
      id: route.billerProfile.id,
      providerCode: route.billerProfile.providerCode,
      billerId: route.billerProfile.billerId,
      credentialsEncrypted: route.billerProfile.credentialsEncrypted,
      config: route.billerProfile.config,
    },
  });

  await prisma.providerAttempt.create({
    data: {
      paymentIntentId: created.id,
      billerProfileId: route.billerProfile.id,
      type: "CREATE_PAYMENT",
      status: providerResult.success ? "SUCCEEDED" : "FAILED",
      requestId: `req_${nanoid(20)}`,
      providerCode: route.providerCode,
      providerEndpoint: "create-payment",
      httpMethod: "POST",
      requestBody: providerResult.rawRequest as any,
      responseBody: providerResult.rawResponse as any,
      providerReference: providerResult.providerReference,
      providerTxnId: providerResult.providerTransactionId,
      errorCode: providerResult.errorCode,
      errorMessage: providerResult.errorMessage,
      sentAt: new Date(),
      completedAt: new Date(),
    },
  });

  const updated = await prisma.paymentIntent.update({
    where: { id: created.id },
    data: providerResult.success
      ? {
          status: "AWAITING_CUSTOMER",
          providerReference: providerResult.providerReference,
          providerTransactionId: providerResult.providerTransactionId,
          qrPayload: providerResult.qrPayload,
          deeplinkUrl: providerResult.deeplinkUrl,
          redirectUrl: providerResult.redirectUrl,
          events: {
            create: [
              {
                type: "PROVIDER_ACCEPTED",
                fromStatus: "PENDING_PROVIDER",
                toStatus: "AWAITING_CUSTOMER",
                summary: "Provider created payment successfully",
              },
            ],
          },
        }
      : {
          status: "FAILED",
          failedAt: new Date(),
          events: {
            create: [
              {
                type: "PROVIDER_REJECTED",
                fromStatus: "PENDING_PROVIDER",
                toStatus: "FAILED",
                summary:
                  providerResult.errorMessage || "Provider rejected payment",
                payload: {
                  errorCode: providerResult.errorCode,
                },
              },
            ],
          },
        },
  });

  const response: CreatePaymentIntentResult = {
    publicId: updated.publicId,
    status: updated.status,
    amount: updated.amount.toString(),
    currency: updated.currency,
    qrPayload: updated.qrPayload,
    deeplinkUrl: updated.deeplinkUrl,
    redirectUrl: updated.redirectUrl,
    expiresAt: updated.expiresAt?.toISOString() || null,
  };

  if (idem) {
    await prisma.idempotencyKey.update({
      where: {
        tenantId_key: {
          tenantId: auth.tenantId,
          key: idem.key,
        },
      },
      data: {
        completedAt: new Date(),
        responseStatusCode: 200,
        responseBody: response as any,
        resourceType: "PaymentIntent",
        resourceId: updated.id,
      },
    });
  }

  return response;
}
