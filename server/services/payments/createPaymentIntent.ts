import type { H3Event } from "h3";
import { nanoid } from "nanoid";
import { prisma } from "~/server/lib/prisma";
import { AppError } from "~/server/lib/errors";
import { resolvePaymentRoute } from "../routing/resolvePaymentRoute";
import {
  completeIdempotency,
  releaseIdempotencyLock,
  reserveIdempotency,
} from "../idempotency/reserveIdempotency";
import { getProviderAdapter } from "../providers/registry";
import {
  applyPaymentTransition,
} from "~/server/services/payments/stateMachine";
import type {
  CreatePaymentIntentInput,
  CreatePaymentIntentResult,
} from "~/server/types/payment";
import type { AuthContext } from "~/server/types/auth";

function toResponse(paymentIntent: {
  id?: string;
  publicId: string;
  status: string;
  amount: { toString(): string };
  currency: string;
  qrPayload: string | null;
  deeplinkUrl: string | null;
  redirectUrl: string | null;
  expiresAt: Date | null;
}) : CreatePaymentIntentResult {
  return {
    publicId: paymentIntent.publicId,
    status: paymentIntent.status,
    amount: paymentIntent.amount.toString(),
    currency: paymentIntent.currency,
    qrPayload: paymentIntent.qrPayload,
    deeplinkUrl: paymentIntent.deeplinkUrl,
    redirectUrl: paymentIntent.redirectUrl,
    expiresAt: paymentIntent.expiresAt?.toISOString() || null,
  };
}

export async function createPaymentIntent(
  auth: AuthContext,
  input: CreatePaymentIntentInput,
  opts?: { idempotencyKey?: string | null; event?: H3Event | null },
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
    return toResponse(existingMerchantOrder);
  }

  const idem = await reserveIdempotency({
    tenantId: auth.tenantId,
    key: opts?.idempotencyKey,
    requestPath: "/api/v1/payment-intents",
    requestMethod: "POST",
    requestBody: input,
    event: opts?.event ?? undefined,
  });

  if (idem?.status === "REPLAY" && idem.responseBody) {
    return idem.responseBody as CreatePaymentIntentResult;
  }

  let created:
    | {
        id: string;
        publicId: string;
        amount: any;
        currency: string;
        merchantOrderId: string | null;
        expiresAt: Date | null;
      }
    | null = null;

  try {
    const route = await resolvePaymentRoute({
      tenantId: auth.tenantId,
      paymentMethodType: "PROMPTPAY_QR",
      currency: "THB",
    });

    const publicId = `piq_${nanoid(24)}`;
    const callbackUrl = `${process.env.APP_BASE_URL}/api/v1/providers/scb/callback`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    created = await prisma.paymentIntent.create({
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
        status: "CREATED",
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
          ],
        },
      },
    });

    await applyPaymentTransition({
      paymentIntentId: created.id,
      toStatus: "ROUTING",
      eventType: "ROUTE_RESOLVED",
      summary: "Route resolved",
      payload: {
        routeId: route.id,
        billerProfileId: route.billerProfile.id,
        providerCode: route.providerCode,
      },
    });

    await applyPaymentTransition({
      paymentIntentId: created.id,
      toStatus: "PENDING_PROVIDER",
      eventType: "PROVIDER_REQUESTED",
      summary: "Provider create payment requested",
      payload: {
        providerCode: route.providerCode,
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

    const transitioned = providerResult.success
      ? await applyPaymentTransition({
          paymentIntentId: created.id,
          toStatus: "AWAITING_CUSTOMER",
          eventType: "PROVIDER_ACCEPTED",
          summary: "Provider created payment successfully",
          patch: {
            providerReference: providerResult.providerReference,
            providerTransactionId: providerResult.providerTransactionId,
            qrPayload: providerResult.qrPayload,
            deeplinkUrl: providerResult.deeplinkUrl,
            redirectUrl: providerResult.redirectUrl,
          },
          payload: {
            providerReference: providerResult.providerReference,
            providerTransactionId: providerResult.providerTransactionId,
          },
        })
      : await applyPaymentTransition({
          paymentIntentId: created.id,
          toStatus: "FAILED",
          eventType: "PROVIDER_REJECTED",
          summary:
            providerResult.errorMessage || "Provider rejected payment",
          payload: {
            errorCode: providerResult.errorCode,
            errorMessage: providerResult.errorMessage,
          },
        });

    const response = toResponse(transitioned.payment);

    await completeIdempotency({
      tenantId: auth.tenantId,
      key: opts?.idempotencyKey,
      responseStatusCode: 200,
      responseBody: response,
      resourceType: "PaymentIntent",
      resourceId: transitioned.payment.id,
    });

    return response;
  } catch (error: any) {
    if (created?.id) {
      try {
        const failedTransition = await applyPaymentTransition({
          paymentIntentId: created.id,
          toStatus: "FAILED",
          eventType: "PAYMENT_FAILED",
          summary: "Payment failed due to internal/provider exception",
          allowedFrom: ["CREATED", "ROUTING", "PENDING_PROVIDER", "AWAITING_CUSTOMER", "PROCESSING"],
          payload: {
            message:
              typeof error?.message === "string"
                ? error.message.slice(0, 500)
                : "unknown",
          },
        });

        const failureResponse = toResponse(failedTransition.payment);

        await completeIdempotency({
          tenantId: auth.tenantId,
          key: opts?.idempotencyKey,
          responseStatusCode: 200,
          responseBody: failureResponse,
          resourceType: "PaymentIntent",
          resourceId: failedTransition.payment.id,
        });
      } catch {
        // best effort
      }
    } else {
      try {
        await releaseIdempotencyLock({
          tenantId: auth.tenantId,
          key: opts?.idempotencyKey,
        });
      } catch {
        // best effort
      }
    }

    throw error;
  }
}