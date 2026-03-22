import type { ProviderBillerProfile } from "../base/PaymentProvider"
import type { ScbProviderConfig } from "./scb.types"

type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {}
}

function pickString(record: UnknownRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }
  return undefined
}

function pickNumber(record: UnknownRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === "number" && Number.isFinite(value)) {
      return value
    }
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) return parsed
    }
  }
  return undefined
}

export function isScbMockMode(billerProfile?: ProviderBillerProfile): boolean {
  const config = asRecord(billerProfile?.config)

  if (config.mock === true || config.mode === "mock") {
    return true
  }

  if (config.mock === false || config.mode === "live") {
    return false
  }

  return process.env.PAYIQ_PROVIDER_MODE === "mock"
}

export function getScbConfig(billerProfile: ProviderBillerProfile): ScbProviderConfig {
  const config = asRecord(billerProfile.config)
  const credentials = asRecord(billerProfile.credentialsEncrypted)

  const apiBaseUrl =
    pickString(config, ["apiBaseUrl", "baseUrl", "api_base_url"]) ||
    process.env.SCB_API_BASE_URL ||
    "https://api-sandbox.partners.scb"

  const apiKey =
    pickString(config, ["apiKey", "clientId", "client_id"]) ||
    pickString(credentials, ["apiKey", "clientId", "client_id"]) ||
    process.env.SCB_API_KEY ||
    process.env.SCB_CLIENT_ID ||
    ""

  const apiSecret =
    pickString(config, ["apiSecret", "clientSecret", "client_secret"]) ||
    pickString(credentials, ["apiSecret", "clientSecret", "client_secret"]) ||
    process.env.SCB_API_SECRET ||
    process.env.SCB_CLIENT_SECRET ||
    ""

  const billerId =
    pickString(config, ["billerId", "biller_id"]) ||
    billerProfile.billerId ||
    process.env.SCB_BILLER_ID ||
    ""

  const merchantId =
    pickString(config, ["merchantId", "merchant_id"]) ||
    billerProfile.merchantIdAtProvider ||
    process.env.SCB_MERCHANT_ID ||
    null

  const terminalId =
    pickString(config, ["terminalId", "merchantTerminalId", "terminal_id"]) ||
    process.env.SCB_MERCHANT_TERMINAL_ID ||
    null

  const callbackSecret =
    pickString(config, ["callbackSecret", "webhookSecret"]) ||
    process.env.SCB_CALLBACK_SECRET ||
    null

  const tokenPath =
    pickString(config, ["tokenPath"]) ||
    "/v1/oauth/token"

  const createQrPath =
    pickString(config, ["createQrPath", "createPaymentPath"]) ||
    "/v1/payment/qrcode/create"

  const inquiryPath =
    pickString(config, ["inquiryPath", "paymentInquiryPath"]) ||
    "/v1/payment/billpayment/inquiry"

  const tokenCacheTtlSec =
    pickNumber(config, ["tokenCacheTtlSec"]) ||
    Number(process.env.SCB_TOKEN_CACHE_TTL_SEC || 840)

  const normalized: ScbProviderConfig = {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""),
    apiKey,
    apiSecret,
    billerId,
    merchantId,
    terminalId,
    callbackSecret,
    tokenPath,
    createQrPath,
    inquiryPath,
    tokenCacheTtlSec,
  }

  const missing: string[] = []

  if (!normalized.apiKey) missing.push("apiKey")
  if (!normalized.apiSecret) missing.push("apiSecret")
  if (!normalized.billerId) missing.push("billerId")

  if (missing.length > 0) {
    throw new Error(
      `SCB biller profile ${billerProfile.id} is missing required config: ${missing.join(", ")}`,
    )
  }

  return normalized
}