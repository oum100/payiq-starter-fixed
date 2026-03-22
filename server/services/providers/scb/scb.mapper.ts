import type {
  CreateProviderPaymentResult,
  ProviderInquiryResult,
} from "../base/PaymentProvider"
import type {
  ScbCreateQrRequest,
  ScbCreateQrResponse,
  ScbInquiryRequest,
  ScbInquiryResponse,
} from "./scb.types"

export function mapScbStatusToInternal(
  status?: string,
): "PENDING" | "SUCCEEDED" | "FAILED" | "EXPIRED" {
  const value = (status || "").trim().toUpperCase()

  if (["SUCCESS", "SUCCEEDED", "PAID", "COMPLETED"].includes(value)) {
    return "SUCCEEDED"
  }

  if (["PENDING", "PROCESSING", "WAITING", "CREATED", "INITIATED"].includes(value)) {
    return "PENDING"
  }

  if (["EXPIRED", "TIMEOUT"].includes(value)) {
    return "EXPIRED"
  }

  return "FAILED"
}

export function getScbResponseCode(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null

  const record = payload as Record<string, unknown>

  const nestedStatus = record.status
  if (nestedStatus && typeof nestedStatus === "object") {
    const code = (nestedStatus as Record<string, unknown>).code
    if (typeof code === "string" || typeof code === "number") {
      return String(code)
    }
  }

  const topLevelCode = record.statusCode
  if (typeof topLevelCode === "string" || typeof topLevelCode === "number") {
    return String(topLevelCode)
  }

  return null
}

export function getScbResponseDescription(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null

  const record = payload as Record<string, unknown>

  const nestedStatus = record.status
  if (nestedStatus && typeof nestedStatus === "object") {
    const description = (nestedStatus as Record<string, unknown>).description
    if (typeof description === "string" && description.trim()) {
      return description.trim()
    }
  }

  const topLevelDesc = record.statusDesc
  if (typeof topLevelDesc === "string" && topLevelDesc.trim()) {
    return topLevelDesc.trim()
  }

  return null
}

export function mapScbCreateResponse(args: {
  request: ScbCreateQrRequest
  response: ScbCreateQrResponse | null
  ok: boolean
  rawRequest?: unknown
  rawResponse?: unknown
}): CreateProviderPaymentResult {
  const transactionId =
    args.response?.data?.transactionId ||
    args.response?.transactionId ||
    null

  const qrPayload =
    args.response?.data?.qrRawData ||
    args.response?.data?.qrCode ||
    args.response?.qrRawData ||
    args.response?.qrCode ||
    null

  const deeplinkUrl =
    args.response?.data?.deeplinkUrl ||
    args.response?.deeplinkUrl ||
    null

  const redirectUrl =
    args.response?.data?.redirectUrl ||
    args.response?.redirectUrl ||
    null

  const success = args.ok && Boolean(transactionId || qrPayload)

  return {
    success,
    providerReference: transactionId,
    providerTransactionId: transactionId,
    qrPayload,
    deeplinkUrl,
    redirectUrl,
    rawRequest: args.rawRequest,
    rawResponse: args.rawResponse,
    errorCode: success ? null : getScbResponseCode(args.response),
    errorMessage: success
      ? null
      : getScbResponseDescription(args.response) || "SCB create payment failed",
  }
}

export function mapScbInquiryResponse(args: {
  request: ScbInquiryRequest
  response: ScbInquiryResponse | null
  rawResponse?: unknown
}): ProviderInquiryResult {
  const transactionId =
    args.response?.data?.transactionId ||
    args.response?.transactionId ||
    args.request.transactionId ||
    null

  const partnerPaymentId =
    args.response?.data?.partnerPaymentId ||
    args.response?.partnerPaymentId ||
    args.request.partnerPaymentId ||
    null

  const externalStatus =
    args.response?.data?.status ||
    args.response?.paymentStatus ||
    args.response?.statusText ||
    undefined

  return {
    providerReference: partnerPaymentId,
    providerTransactionId: transactionId,
    status: mapScbStatusToInternal(externalStatus),
    rawResponse: args.rawResponse,
  }
}