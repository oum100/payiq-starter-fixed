export type ScbProviderConfig = {
  apiBaseUrl: string
  apiKey: string
  apiSecret: string
  billerId: string
  merchantId?: string | null
  terminalId?: string | null
  callbackSecret?: string | null
  tokenPath: string
  createQrPath: string
  inquiryPath: string
  tokenCacheTtlSec: number
}

export type ScbTokenResponse = {
  status?: {
    code?: number | string
    description?: string
  }
  data?: {
    accessToken?: string
    expiresIn?: number | string
    tokenType?: string
  }
  accessToken?: string
  expiresIn?: number | string
  tokenType?: string
}

export type ScbCreateQrRequest = {
  partnerPaymentId: string
  partnerOrderId: string
  merchantReference?: string | null
  amount: number
  currency: string
  billerId: string
  merchantId?: string | null
  terminalId?: string | null
  callbackUrl: string
  expiryDateTime?: string | null
}

export type ScbCreateQrResponse = {
  status?: {
    code?: number | string
    description?: string
  }
  data?: {
    transactionId?: string
    partnerPaymentId?: string
    qrRawData?: string
    qrCode?: string
    deeplinkUrl?: string
    redirectUrl?: string
    status?: string
  }
  transactionId?: string
  partnerPaymentId?: string
  qrRawData?: string
  qrCode?: string
  deeplinkUrl?: string
  redirectUrl?: string
  statusCode?: string | number
  statusDesc?: string
  paymentStatus?: string
}

export type ScbInquiryRequest = {
  transactionId?: string | null
  partnerPaymentId?: string | null
  billerId: string
  merchantId?: string | null
}

export type ScbInquiryResponse = {
  status?: {
    code?: number | string
    description?: string
  }
  data?: {
    transactionId?: string
    partnerPaymentId?: string
    status?: string
    amount?: number | string
    paidAmount?: number | string
  }
  transactionId?: string
  partnerPaymentId?: string
  statusCode?: string | number
  statusDesc?: string
  statusText?: string
  paymentStatus?: string
}

export type ScbTransportResponse<T> = {
  ok: boolean
  status: number
  headers: Record<string, string>
  data: T | null
  rawText: string
}

export type ScbAuditPayload = {
  url: string
  headers: Record<string, string>
  body?: unknown
}