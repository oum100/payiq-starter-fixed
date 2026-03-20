import { p as prisma, A as AppError, f as setResponseHeader, i as getClientIpHash, j as redis, k as createError, l as sha256, m as buildPaymentSpamKey, P as PAYMENT_SPAM_LIMITS, n as buildTempBlockKey, d as defineEventHandler, r as requireApiKeyAuth, a as readBody, o as getHeader, s as setResponseStatus } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { createHash } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { r as requireScope } from '../../../_/requireScope.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'ioredis';

async function resolvePaymentRoute(params) {
  const route = await prisma.paymentRoute.findFirst({
    where: {
      tenantId: params.tenantId,
      paymentMethodType: params.paymentMethodType,
      currency: params.currency,
      status: "ACTIVE"
    },
    include: {
      billerProfile: true
    },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }]
  });
  if (!route) throw new AppError("ROUTE_NOT_FOUND", "No active payment route found", 422);
  if (route.billerProfile.status !== "ACTIVE") throw new AppError("BILLER_INACTIVE", "Resolved biller is inactive", 422);
  return route;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1e3;
const DEFAULT_LOCK_TIMEOUT_MS = 30 * 1e3;
function canonicalize(value) {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (typeof value === "object") {
    const input = value;
    const output = {};
    for (const key of Object.keys(input).sort()) {
      const v = input[key];
      if (typeof v === "undefined") continue;
      output[key] = canonicalize(v);
    }
    return output;
  }
  return String(value);
}
function hashRequestBody(body) {
  const normalized = canonicalize(body);
  const serialized = JSON.stringify(normalized);
  return createHash("sha256").update(serialized).digest("hex");
}
function nowPlus(ms) {
  return new Date(Date.now() + ms);
}
function getRetryAfterSeconds(lockedAt, lockTimeoutMs) {
  const remainingMs = lockedAt.getTime() + lockTimeoutMs - Date.now();
  return Math.max(1, Math.ceil(remainingMs / 1e3));
}
function setIdempotencyStatus(event, status) {
  if (!event) return;
  setResponseHeader(event, "Idempotency-Status", status);
}
async function reserveIdempotency(input) {
  var _a, _b;
  if (!input.key) return null;
  const ttlMs = (_a = input.ttlMs) != null ? _a : DEFAULT_TTL_MS;
  const lockTimeoutMs = (_b = input.lockTimeoutMs) != null ? _b : DEFAULT_LOCK_TIMEOUT_MS;
  const requestHash = hashRequestBody(input.requestBody);
  while (true) {
    const now = /* @__PURE__ */ new Date();
    const existing = await prisma.idempotencyKey.findUnique({
      where: {
        tenantId_key: {
          tenantId: input.tenantId,
          key: input.key
        }
      }
    });
    if (!existing) {
      try {
        await prisma.idempotencyKey.create({
          data: {
            tenantId: input.tenantId,
            key: input.key,
            requestPath: input.requestPath,
            requestMethod: input.requestMethod.toUpperCase(),
            requestHash,
            lockedAt: now,
            completedAt: null,
            responseStatusCode: null,
            responseBody: Prisma.JsonNull,
            resourceType: null,
            resourceId: null,
            expiresAt: nowPlus(ttlMs)
          }
        });
        setIdempotencyStatus(input.event, "created");
        return {
          key: input.key,
          requestHash,
          status: "STARTED"
        };
      } catch (error) {
        if ((error == null ? void 0 : error.code) === "P2002") {
          continue;
        }
        throw error;
      }
    }
    if (existing.expiresAt && existing.expiresAt.getTime() <= now.getTime()) {
      const reclaimed = await prisma.idempotencyKey.updateMany({
        where: {
          tenantId: input.tenantId,
          key: input.key,
          updatedAt: existing.updatedAt
        },
        data: {
          requestPath: input.requestPath,
          requestMethod: input.requestMethod.toUpperCase(),
          requestHash,
          lockedAt: now,
          completedAt: null,
          responseStatusCode: null,
          responseBody: Prisma.JsonNull,
          resourceType: null,
          resourceId: null,
          expiresAt: nowPlus(ttlMs)
        }
      });
      if (reclaimed.count === 1) {
        setIdempotencyStatus(input.event, "created");
        return {
          key: input.key,
          requestHash,
          status: "STARTED"
        };
      }
      continue;
    }
    if (existing.requestHash !== requestHash) {
      setIdempotencyStatus(input.event, "conflict");
      throw new AppError(
        "IDEMPOTENCY_KEY_CONFLICT",
        "Idempotency-Key was already used with a different request payload",
        409
      );
    }
    if (existing.completedAt) {
      setIdempotencyStatus(input.event, "replay");
      return {
        key: existing.key,
        requestHash: existing.requestHash,
        status: "REPLAY",
        responseStatusCode: existing.responseStatusCode,
        responseBody: existing.responseBody,
        resourceType: existing.resourceType,
        resourceId: existing.resourceId
      };
    }
    if (existing.lockedAt) {
      const ageMs = now.getTime() - existing.lockedAt.getTime();
      if (ageMs < lockTimeoutMs) {
        setIdempotencyStatus(input.event, "in_progress");
        throw new AppError(
          "IDEMPOTENCY_IN_PROGRESS",
          "A request with this Idempotency-Key is already in progress",
          409,
          {
            retryAfterSec: getRetryAfterSeconds(
              existing.lockedAt,
              lockTimeoutMs
            )
          }
        );
      }
    }
    const claimed = await prisma.idempotencyKey.updateMany({
      where: {
        tenantId: input.tenantId,
        key: input.key,
        updatedAt: existing.updatedAt
      },
      data: {
        lockedAt: now,
        expiresAt: nowPlus(ttlMs)
      }
    });
    if (claimed.count === 1) {
      setIdempotencyStatus(input.event, "created");
      return {
        key: input.key,
        requestHash,
        status: "STARTED"
      };
    }
  }
}
async function completeIdempotency(input) {
  var _a, _b;
  if (!input.key) return;
  await prisma.idempotencyKey.update({
    where: {
      tenantId_key: {
        tenantId: input.tenantId,
        key: input.key
      }
    },
    data: {
      completedAt: /* @__PURE__ */ new Date(),
      lockedAt: null,
      expiresAt: nowPlus(DEFAULT_TTL_MS),
      responseStatusCode: input.responseStatusCode,
      responseBody: input.responseBody,
      resourceType: (_a = input.resourceType) != null ? _a : null,
      resourceId: (_b = input.resourceId) != null ? _b : null
    }
  });
}
async function releaseIdempotencyLock(input) {
  if (!input.key) return;
  await prisma.idempotencyKey.update({
    where: {
      tenantId_key: {
        tenantId: input.tenantId,
        key: input.key
      }
    },
    data: {
      lockedAt: null
    }
  });
}

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, headers: res.headers };
}

function mapScbStatusToInternal(status) {
  const v = (status || "").toUpperCase();
  if (["SUCCESS", "PAID", "COMPLETED"].includes(v)) return "SUCCEEDED";
  if (["PENDING", "PROCESSING", "WAITING"].includes(v)) return "PENDING";
  if (["EXPIRED"].includes(v)) return "EXPIRED";
  return "FAILED";
}

function getScbHeaders() {
  return {
    "x-client-id": process.env.SCB_CLIENT_ID || "",
    "x-client-secret": process.env.SCB_CLIENT_SECRET || ""
  };
}
function buildMockQr(publicId, amount) {
  return `00020101021129370016A0000006770101110113${publicId.slice(0, 13)}5303764540${amount}5802TH6304ABCD`;
}
const demoMode = process.env.PAYIQ_PROVIDER_MODE === "mock" || !process.env.SCB_API_BASE_URL || !process.env.SCB_CLIENT_ID || !process.env.SCB_CLIENT_SECRET;
const scbProvider = {
  async createPayment(input) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    if (demoMode) {
      return {
        success: true,
        providerReference: `mock-ref-${input.publicId}`,
        providerTransactionId: `mock-txn-${input.publicId}`,
        qrPayload: buildMockQr(input.publicId, input.amount),
        deeplinkUrl: null,
        redirectUrl: null,
        rawRequest: {
          mode: "mock",
          publicId: input.publicId,
          amount: input.amount
        },
        rawResponse: {
          success: true,
          mode: "mock"
        },
        errorCode: null,
        errorMessage: null
      };
    }
    const url = `${process.env.SCB_API_BASE_URL}/payments/create`;
    const requestBody = {
      partnerPaymentId: input.publicId,
      billerId: input.billerProfile.billerId,
      amount: Number(input.amount),
      currency: input.currency,
      callbackUrl: input.callbackUrl,
      merchantOrderId: input.merchantOrderId || input.publicId
    };
    try {
      const result = await postJson(url, requestBody, getScbHeaders());
      const ok = result.status >= 200 && result.status < 300;
      return {
        success: ok,
        providerReference: ((_b = (_a = result.data) == null ? void 0 : _a.data) == null ? void 0 : _b.transactionId) || ((_c = result.data) == null ? void 0 : _c.transactionId) || null,
        providerTransactionId: ((_e = (_d = result.data) == null ? void 0 : _d.data) == null ? void 0 : _e.transactionId) || ((_f = result.data) == null ? void 0 : _f.transactionId) || null,
        qrPayload: ((_h = (_g = result.data) == null ? void 0 : _g.data) == null ? void 0 : _h.qrRawData) || ((_i = result.data) == null ? void 0 : _i.qrRawData) || null,
        deeplinkUrl: ((_k = (_j = result.data) == null ? void 0 : _j.data) == null ? void 0 : _k.deeplinkUrl) || ((_l = result.data) == null ? void 0 : _l.deeplinkUrl) || null,
        redirectUrl: ((_n = (_m = result.data) == null ? void 0 : _m.data) == null ? void 0 : _n.redirectUrl) || ((_o = result.data) == null ? void 0 : _o.redirectUrl) || null,
        rawRequest: requestBody,
        rawResponse: result.data,
        errorCode: ok ? null : String(result.status),
        errorMessage: ok ? null : "SCB create payment failed"
      };
    } catch (error) {
      return {
        success: false,
        providerReference: null,
        providerTransactionId: null,
        qrPayload: null,
        deeplinkUrl: null,
        redirectUrl: null,
        rawRequest: requestBody,
        rawResponse: {
          error: (error == null ? void 0 : error.message) || "Unknown fetch error"
        },
        errorCode: "FETCH_ERROR",
        errorMessage: (error == null ? void 0 : error.message) || "SCB create payment failed"
      };
    }
  },
  async inquirePayment(input) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (demoMode) {
      return {
        providerReference: input.providerReference || null,
        providerTransactionId: input.providerTransactionId || null,
        status: "SUCCEEDED",
        rawResponse: {
          mode: "mock",
          status: "SUCCESS"
        }
      };
    }
    const url = `${process.env.SCB_API_BASE_URL}/payments/inquiry`;
    const requestBody = {
      transactionId: input.providerTransactionId || input.providerReference,
      billerId: input.billerProfile.billerId
    };
    const result = await postJson(url, requestBody, getScbHeaders());
    return {
      providerReference: ((_b = (_a = result.data) == null ? void 0 : _a.data) == null ? void 0 : _b.transactionId) || ((_c = result.data) == null ? void 0 : _c.transactionId) || input.providerReference || null,
      providerTransactionId: ((_e = (_d = result.data) == null ? void 0 : _d.data) == null ? void 0 : _e.transactionId) || ((_f = result.data) == null ? void 0 : _f.transactionId) || input.providerTransactionId || null,
      status: mapScbStatusToInternal(
        ((_h = (_g = result.data) == null ? void 0 : _g.data) == null ? void 0 : _h.status) || ((_i = result.data) == null ? void 0 : _i.status)
      ),
      rawResponse: result.data
    };
  }
};

function getProviderAdapter(providerCode) {
  switch (providerCode) {
    case "SCB":
      return scbProvider;
    default:
      throw new Error(`Unsupported provider: ${providerCode}`);
  }
}

function toResponse(paymentIntent) {
  var _a;
  return {
    publicId: paymentIntent.publicId,
    status: paymentIntent.status,
    amount: paymentIntent.amount.toString(),
    currency: paymentIntent.currency,
    qrPayload: paymentIntent.qrPayload,
    deeplinkUrl: paymentIntent.deeplinkUrl,
    redirectUrl: paymentIntent.redirectUrl,
    expiresAt: ((_a = paymentIntent.expiresAt) == null ? void 0 : _a.toISOString()) || null
  };
}
async function createPaymentIntent(auth, input, opts) {
  var _a, _b;
  if (!auth.merchantAccountId) {
    throw new AppError(
      "FORBIDDEN",
      "API key is not bound to a merchant account",
      403
    );
  }
  const merchant = await prisma.merchantAccount.findFirst({
    where: {
      id: auth.merchantAccountId,
      tenantId: auth.tenantId,
      status: "ACTIVE"
    }
  });
  if (!merchant) {
    throw new AppError(
      "MERCHANT_NOT_FOUND",
      "Merchant not found or inactive",
      404
    );
  }
  const existingMerchantOrder = input.merchantOrderId ? await prisma.paymentIntent.findFirst({
    where: {
      tenantId: auth.tenantId,
      merchantAccountId: merchant.id,
      merchantOrderId: input.merchantOrderId
    }
  }) : null;
  if (existingMerchantOrder) {
    return toResponse(existingMerchantOrder);
  }
  const idem = await reserveIdempotency({
    tenantId: auth.tenantId,
    key: opts == null ? void 0 : opts.idempotencyKey,
    requestPath: "/api/v1/payment-intents",
    requestMethod: "POST",
    requestBody: input,
    event: (_a = opts == null ? void 0 : opts.event) != null ? _a : void 0
  });
  if ((idem == null ? void 0 : idem.status) === "REPLAY" && idem.responseBody) {
    return idem.responseBody;
  }
  let created = null;
  try {
    const route = await resolvePaymentRoute({
      tenantId: auth.tenantId,
      paymentMethodType: "PROMPTPAY_QR",
      currency: "THB"
    });
    const publicId = `piq_${nanoid(24)}`;
    const callbackUrl = `${process.env.APP_BASE_URL}/api/v1/providers/scb/callback`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
    created = await prisma.paymentIntent.create({
      data: {
        tenantId: auth.tenantId,
        merchantAccountId: merchant.id,
        paymentRouteId: route.id,
        billerProfileId: route.billerProfile.id,
        publicId,
        merchantOrderId: input.merchantOrderId,
        merchantReference: input.merchantReference,
        idempotencyKeyValue: (opts == null ? void 0 : opts.idempotencyKey) || null,
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
        metadata: input.metadata,
        expiresAt,
        events: {
          create: [
            {
              type: "PAYMENT_CREATED",
              toStatus: "CREATED",
              summary: "Payment intent created"
            },
            {
              type: "ROUTE_RESOLVED",
              fromStatus: "CREATED",
              toStatus: "ROUTING",
              summary: "Route resolved",
              payload: {
                routeId: route.id,
                billerProfileId: route.billerProfile.id,
                providerCode: route.providerCode
              }
            }
          ]
        }
      }
    });
    const provider = getProviderAdapter(route.providerCode);
    const providerResult = await provider.createPayment({
      paymentIntentId: created.id,
      publicId: created.publicId,
      amount: created.amount.toString(),
      currency: created.currency,
      merchantOrderId: created.merchantOrderId,
      expiresAt: ((_b = created.expiresAt) == null ? void 0 : _b.toISOString()) || null,
      callbackUrl,
      billerProfile: {
        id: route.billerProfile.id,
        providerCode: route.billerProfile.providerCode,
        billerId: route.billerProfile.billerId,
        credentialsEncrypted: route.billerProfile.credentialsEncrypted,
        config: route.billerProfile.config
      }
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
        requestBody: providerResult.rawRequest,
        responseBody: providerResult.rawResponse,
        providerReference: providerResult.providerReference,
        providerTxnId: providerResult.providerTransactionId,
        errorCode: providerResult.errorCode,
        errorMessage: providerResult.errorMessage,
        sentAt: /* @__PURE__ */ new Date(),
        completedAt: /* @__PURE__ */ new Date()
      }
    });
    const updated = await prisma.paymentIntent.update({
      where: { id: created.id },
      data: providerResult.success ? {
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
              summary: "Provider created payment successfully"
            }
          ]
        }
      } : {
        status: "FAILED",
        failedAt: /* @__PURE__ */ new Date(),
        events: {
          create: [
            {
              type: "PROVIDER_REJECTED",
              fromStatus: "PENDING_PROVIDER",
              toStatus: "FAILED",
              summary: providerResult.errorMessage || "Provider rejected payment",
              payload: {
                errorCode: providerResult.errorCode
              }
            }
          ]
        }
      }
    });
    const response = toResponse(updated);
    await completeIdempotency({
      tenantId: auth.tenantId,
      key: opts == null ? void 0 : opts.idempotencyKey,
      responseStatusCode: 200,
      responseBody: response,
      resourceType: "PaymentIntent",
      resourceId: updated.id
    });
    return response;
  } catch (error) {
    if (created == null ? void 0 : created.id) {
      try {
        const failed = await prisma.paymentIntent.update({
          where: { id: created.id },
          data: {
            status: "FAILED",
            failedAt: /* @__PURE__ */ new Date(),
            events: {
              create: [
                {
                  type: "PAYMENT_INTERNAL_ERROR",
                  fromStatus: "PENDING_PROVIDER",
                  toStatus: "FAILED",
                  summary: "Payment failed due to internal/provider exception",
                  payload: {
                    message: typeof (error == null ? void 0 : error.message) === "string" ? error.message.slice(0, 500) : "unknown"
                  }
                }
              ]
            }
          }
        });
        const failureResponse = toResponse(failed);
        await completeIdempotency({
          tenantId: auth.tenantId,
          key: opts == null ? void 0 : opts.idempotencyKey,
          responseStatusCode: 200,
          responseBody: failureResponse,
          resourceType: "PaymentIntent",
          resourceId: failed.id
        });
      } catch {
      }
    } else {
      try {
        await releaseIdempotencyLock({
          tenantId: auth.tenantId,
          key: opts == null ? void 0 : opts.idempotencyKey
        });
      } catch {
      }
    }
    throw error;
  }
}

async function checkPaymentSpamOrThrow(event, input) {
  var _a, _b, _c, _d, _e;
  const ipHash = getClientIpHash(event);
  const blockedKey = buildTempBlockKey(
    "payment-spam",
    `${input.merchantAccountId}:${ipHash}`
  );
  const blockedTtl = await redis.ttl(blockedKey);
  if (blockedTtl > 0) {
    setResponseHeader(event, "Retry-After", blockedTtl);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_BLOCKED",
        retryAfterSec: blockedTtl
      }
    });
  }
  const referenceHash = sha256(((_a = input.reference) == null ? void 0 : _a.trim()) || "no-ref");
  const amountKey = `${input.amount}:${input.currency}`;
  const duplicateRefKey = buildPaymentSpamKey(
    "dupref",
    input.merchantAccountId,
    referenceHash,
    amountKey
  );
  const velocityKey = buildPaymentSpamKey(
    "velocity",
    input.merchantAccountId,
    ipHash,
    amountKey
  );
  const multi = redis.multi();
  multi.incr(duplicateRefKey);
  multi.expire(
    duplicateRefKey,
    PAYMENT_SPAM_LIMITS.duplicateReference.ttlSec
  );
  multi.incr(velocityKey);
  multi.expire(
    velocityKey,
    PAYMENT_SPAM_LIMITS.amountVelocity.ttlSec
  );
  const results = await multi.exec();
  const duplicateCount = Number((_c = (_b = results == null ? void 0 : results[0]) == null ? void 0 : _b[1]) != null ? _c : 0);
  const velocityCount = Number((_e = (_d = results == null ? void 0 : results[2]) == null ? void 0 : _d[1]) != null ? _e : 0);
  if (duplicateCount > PAYMENT_SPAM_LIMITS.duplicateReference.threshold) {
    await redis.set(
      blockedKey,
      "1",
      "EX",
      PAYMENT_SPAM_LIMITS.duplicateReference.blockSec
    );
    setResponseHeader(
      event,
      "Retry-After",
      PAYMENT_SPAM_LIMITS.duplicateReference.blockSec
    );
    console.warn("[payment-spam]", {
      type: "duplicate-reference",
      merchantAccountId: input.merchantAccountId,
      apiKeyId: input.apiKeyId,
      duplicateCount,
      amount: input.amount,
      currency: input.currency
    });
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_DUPLICATE_REFERENCE",
        retryAfterSec: PAYMENT_SPAM_LIMITS.duplicateReference.blockSec
      }
    });
  }
  if (velocityCount > PAYMENT_SPAM_LIMITS.amountVelocity.threshold) {
    await redis.set(
      blockedKey,
      "1",
      "EX",
      PAYMENT_SPAM_LIMITS.amountVelocity.blockSec
    );
    setResponseHeader(
      event,
      "Retry-After",
      PAYMENT_SPAM_LIMITS.amountVelocity.blockSec
    );
    console.warn("[payment-spam]", {
      type: "amount-velocity",
      merchantAccountId: input.merchantAccountId,
      apiKeyId: input.apiKeyId,
      velocityCount,
      amount: input.amount,
      currency: input.currency
    });
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_AMOUNT_VELOCITY",
        retryAfterSec: PAYMENT_SPAM_LIMITS.amountVelocity.blockSec
      }
    });
  }
}

const schema = z.object({
  merchantOrderId: z.string().optional(),
  merchantReference: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.literal("THB").default("THB"),
  paymentMethodType: z.literal("PROMPTPAY_QR"),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  customerPhone: z.string().optional(),
  metadata: z.record(z.any()).optional()
});
function getApiKeyId(auth) {
  var _a, _b, _c, _d;
  return (_d = (_c = (_b = auth == null ? void 0 : auth.apiKeyId) != null ? _b : (_a = auth == null ? void 0 : auth.apiKey) == null ? void 0 : _a.id) != null ? _c : auth == null ? void 0 : auth.id) != null ? _d : null;
}
function getMerchantAccountId(auth) {
  var _a, _b, _c, _d, _e;
  return (_e = (_d = (_b = auth == null ? void 0 : auth.merchantAccountId) != null ? _b : (_a = auth == null ? void 0 : auth.merchantAccount) == null ? void 0 : _a.id) != null ? _d : (_c = auth == null ? void 0 : auth.apiKey) == null ? void 0 : _c.merchantAccountId) != null ? _e : null;
}
const index_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
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
        reference: (_c = (_b = (_a = body.merchantReference) != null ? _a : body.merchantOrderId) != null ? _b : idempotencyKey) != null ? _c : null
      });
    }
    const result = await createPaymentIntent(auth, body, {
      idempotencyKey,
      event
    });
    return result;
  } catch (error) {
    if (error instanceof AppError) {
      if ((_d = error.details) == null ? void 0 : _d.retryAfterSec) {
        setResponseHeader(
          event,
          "Retry-After",
          error.details.retryAfterSec.toString()
        );
      }
      setResponseStatus(event, error.statusCode);
      return {
        error: error.code,
        message: error.message,
        details: error.details
      };
    }
    if (error == null ? void 0 : error.statusCode) {
      setResponseStatus(event, error.statusCode);
      return {
        error: ((_e = error == null ? void 0 : error.data) == null ? void 0 : _e.code) || "REQUEST_ERROR",
        message: (error == null ? void 0 : error.statusMessage) || (error == null ? void 0 : error.message) || "Request failed",
        details: error == null ? void 0 : error.data
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
//# sourceMappingURL=index.post2.mjs.map
