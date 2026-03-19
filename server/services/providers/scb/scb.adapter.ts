import type {
  CreateProviderPaymentInput,
  CreateProviderPaymentResult,
  PaymentProvider,
  ProviderInquiryResult,
} from "../base/PaymentProvider"
import { postJson } from "~/server/lib/http"
import { mapScbStatusToInternal } from "./scb.mapper"

function getScbHeaders() {
  return {
    "x-client-id": process.env.SCB_CLIENT_ID || "",
    "x-client-secret": process.env.SCB_CLIENT_SECRET || "",
  }
}

function buildMockQr(publicId: string, amount: string) {
  return `00020101021129370016A0000006770101110113${publicId.slice(0, 13)}5303764540${amount}5802TH6304ABCD`
}

const demoMode =
  process.env.PAYIQ_PROVIDER_MODE === "mock" ||
  !process.env.SCB_API_BASE_URL ||
  !process.env.SCB_CLIENT_ID ||
  !process.env.SCB_CLIENT_SECRET

export const scbProvider: PaymentProvider = {
  async createPayment(input: CreateProviderPaymentInput): Promise<CreateProviderPaymentResult> {
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
          amount: input.amount,
        },
        rawResponse: {
          success: true,
          mode: "mock",
        },
        errorCode: null,
        errorMessage: null,
      }
    }

    const url = `${process.env.SCB_API_BASE_URL}/payments/create`

    const requestBody = {
      partnerPaymentId: input.publicId,
      billerId: input.billerProfile.billerId,
      amount: Number(input.amount),
      currency: input.currency,
      callbackUrl: input.callbackUrl,
      merchantOrderId: input.merchantOrderId || input.publicId,
    }

    try {
      const result = await postJson<any>(url, requestBody, getScbHeaders())
      const ok = result.status >= 200 && result.status < 300

      return {
        success: ok,
        providerReference:
          result.data?.data?.transactionId ||
          result.data?.transactionId ||
          null,
        providerTransactionId:
          result.data?.data?.transactionId ||
          result.data?.transactionId ||
          null,
        qrPayload:
          result.data?.data?.qrRawData ||
          result.data?.qrRawData ||
          null,
        deeplinkUrl:
          result.data?.data?.deeplinkUrl ||
          result.data?.deeplinkUrl ||
          null,
        redirectUrl:
          result.data?.data?.redirectUrl ||
          result.data?.redirectUrl ||
          null,
        rawRequest: requestBody,
        rawResponse: result.data,
        errorCode: ok ? null : String(result.status),
        errorMessage: ok ? null : "SCB create payment failed",
      }
    } catch (error: any) {
      return {
        success: false,
        providerReference: null,
        providerTransactionId: null,
        qrPayload: null,
        deeplinkUrl: null,
        redirectUrl: null,
        rawRequest: requestBody,
        rawResponse: {
          error: error?.message || "Unknown fetch error",
        },
        errorCode: "FETCH_ERROR",
        errorMessage: error?.message || "SCB create payment failed",
      }
    }
  },

  async inquirePayment(input): Promise<ProviderInquiryResult> {
    if (demoMode) {
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

    const url = `${process.env.SCB_API_BASE_URL}/payments/inquiry`

    const requestBody = {
      transactionId: input.providerTransactionId || input.providerReference,
      billerId: input.billerProfile.billerId,
    }

    const result = await postJson<any>(url, requestBody, getScbHeaders())

    return {
      providerReference:
        result.data?.data?.transactionId ||
        result.data?.transactionId ||
        input.providerReference ||
        null,
      providerTransactionId:
        result.data?.data?.transactionId ||
        result.data?.transactionId ||
        input.providerTransactionId ||
        null,
      status: mapScbStatusToInternal(
        result.data?.data?.status || result.data?.status,
      ),
      rawResponse: result.data,
    }
  },
}