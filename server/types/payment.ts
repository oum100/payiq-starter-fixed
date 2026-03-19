export type CreatePaymentIntentInput = {
  merchantOrderId?: string
  merchantReference?: string
  amount: string
  currency?: "THB"
  paymentMethodType: "PROMPTPAY_QR"
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  metadata?: Record<string, unknown>
}

export type CreatePaymentIntentResult = {
  publicId: string
  status: string
  amount: string
  currency: string
  qrPayload?: string | null
  deeplinkUrl?: string | null
  redirectUrl?: string | null
  expiresAt?: string | null
}