import type {
  CreateProviderPaymentInput,
  CreateProviderPaymentResult,
  PaymentProvider,
  ProviderBillerProfile,
  ProviderInquiryResult,
} from "../base/PaymentProvider"
import { getScbAccessToken } from "./scb.auth"
import {
  buildScbAuditRequest,
  buildScbAuditResponse,
  postScbJson,
} from "./scb.client"
import { getScbConfig, isScbMockMode } from "./scb.config"
import {
  mapScbCreateResponse,
  mapScbInquiryResponse,
} from "./scb.mapper"
import type {
  ScbCreateQrRequest,
  ScbCreateQrResponse,
  ScbInquiryRequest,
  ScbInquiryResponse,
} from "./scb.types"

function buildMockQr(publicId: string, amount: string): string {
  const amountDigits = amount.replace(/[^\d]/g, "").slice(0, 10) || "0"
  return `00020101021129370016A0000006770101110113${publicId.slice(0, 13)}5303764540${amountDigits}5802TH6304ABCD`
}

function buildRequestUId(): string {
  return crypto.randomUUID()
}

async function createScbPayment(
  input: CreateProviderPaymentInput,
): Promise<CreateProviderPaymentResult> {
  const config = getScbConfig(input.billerProfile)
  const accessToken = await getScbAccessToken(config)

  const requestBody: ScbCreateQrRequest = {
    partnerPaymentId: input.publicId,
    partnerOrderId: input.merchantOrderId || input.publicId,
    merchantReference: input.merchantReference || null,
    amount: Number(input.amount),
    currency: input.currency,
    billerId: config.billerId,
    callbackUrl: input.callbackUrl,
    expiryDateTime: input.expiresAt || null,
    ...(config.merchantId !== null ? { merchantId: config.merchantId } : {}),
    ...(config.terminalId !== null ? { terminalId: config.terminalId } : {}),
  }

  const requestHeaders = {
    resourceOwnerId: config.apiKey,
    requestUId: buildRequestUId(),
    "accept-language": "EN",
  }

  const auditRequest = buildScbAuditRequest({
    url: `${config.apiBaseUrl}${config.createQrPath}`,
    headers: requestHeaders,
    body: requestBody,
  })

  try {
    const response = await postScbJson<ScbCreateQrResponse>({
      url: `${config.apiBaseUrl}${config.createQrPath}`,
      bearerToken: accessToken,
      headers: requestHeaders,
      body: requestBody,
    })

    return mapScbCreateResponse({
      request: requestBody,
      response: response.data,
      ok: response.ok,
      rawRequest: auditRequest,
      rawResponse: buildScbAuditResponse(response),
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown SCB create payment error"

    return {
      success: false,
      providerReference: null,
      providerTransactionId: null,
      qrPayload: null,
      deeplinkUrl: null,
      redirectUrl: null,
      rawRequest: auditRequest,
      rawResponse: {
        error: message,
      },
      errorCode: "FETCH_ERROR",
      errorMessage: message,
    }
  }
}

async function inquireScbPayment(args: {
  providerReference?: string | null
  providerTransactionId?: string | null
  billerProfile: ProviderBillerProfile
}): Promise<ProviderInquiryResult> {
  const config = getScbConfig(args.billerProfile)
  const accessToken = await getScbAccessToken(config)

  const requestBody: ScbInquiryRequest = {
    billerId: config.billerId,
    ...(args.providerTransactionId !== undefined
      ? { transactionId: args.providerTransactionId }
      : {}),
    ...(args.providerReference !== undefined
      ? { partnerPaymentId: args.providerReference }
      : {}),
    ...(config.merchantId !== null ? { merchantId: config.merchantId } : {}),
  }

  const response = await postScbJson<ScbInquiryResponse>({
    url: `${config.apiBaseUrl}${config.inquiryPath}`,
    bearerToken: accessToken,
    headers: {
      resourceOwnerId: config.apiKey,
      requestUId: buildRequestUId(),
      "accept-language": "EN",
    },
    body: requestBody,
  })

  return mapScbInquiryResponse({
    request: requestBody,
    response: response.data,
    rawResponse: buildScbAuditResponse(response),
  })
}

export const scbProvider: PaymentProvider = {
  async createPayment(
    input: CreateProviderPaymentInput,
  ): Promise<CreateProviderPaymentResult> {
    if (isScbMockMode(input.billerProfile)) {
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
          amount: input.amount,
          merchantReference: input.merchantReference || null,
        },
        rawResponse: {
          success: true,
          mode: "mock",
        },
        errorCode: null,
        errorMessage: null,
      }
    }

    return createScbPayment(input)
  },

  async inquirePayment(input: {
    providerReference?: string | null
    providerTransactionId?: string | null
    billerProfile: ProviderBillerProfile
  }): Promise<ProviderInquiryResult> {
    if (isScbMockMode(input.billerProfile)) {
      return {
        providerReference: input.providerReference || null,
        providerTransactionId: input.providerTransactionId || null,
        status: "SUCCEEDED",
        rawResponse: {
          mode: "mock",
          status: "SUCCESS",
        },
      }
    }

    const inquiryArgs: {
      providerReference?: string | null
      providerTransactionId?: string | null
      billerProfile: ProviderBillerProfile
    } = {
      billerProfile: input.billerProfile,
    }

    if (input.providerReference !== undefined) {
      inquiryArgs.providerReference = input.providerReference
    }

    if (input.providerTransactionId !== undefined) {
      inquiryArgs.providerTransactionId = input.providerTransactionId
    }

    return inquireScbPayment(inquiryArgs)
  },
}