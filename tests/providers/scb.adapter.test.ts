import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test"
import { clearScbTokenCache } from "~/server/services/providers/scb/scb.auth"
import { scbProvider } from "~/server/services/providers/scb/scb.adapter"

const originalFetch = global.fetch

function makeInput() {
  return {
    paymentIntentId: "pi_1",
    publicId: "piq_1",
    amount: "20.00",
    currency: "THB",
    merchantOrderId: "ord_1",
    merchantReference: "sess_1",
    expiresAt: "2026-03-22T00:00:00.000Z",
    callbackUrl: "https://example.com/callback",
    billerProfile: {
      id: "bp_1",
      providerCode: "SCB",
      billerId: "biller_1",
      merchantIdAtProvider: "merchant_1",
      credentialsEncrypted: {},
      config: {
        apiBaseUrl: "https://api-sandbox.partners.scb",
        apiKey: "key_1",
        apiSecret: "secret_1",
        billerId: "biller_1",
        merchantId: "merchant_1",
        tokenPath: "/v1/oauth/token",
        createQrPath: "/v1/payment/qrcode/create",
        inquiryPath: "/v1/payment/billpayment/inquiry",
        mode: "live",
      },
    },
  }
}

describe("scb.adapter", () => {
  beforeEach(() => {
    clearScbTokenCache()
  })

  afterEach(() => {
    global.fetch = originalFetch
    mock.restore()
  })

  test("returns mock result when config.mock=true", async () => {
    const base = makeInput()

    const result = await scbProvider.createPayment({
      ...base,
      billerProfile: {
        ...base.billerProfile,
        config: {
          mock: true,
        },
      },
    })

    expect(result.success).toBe(true)
    expect(result.providerTransactionId).toContain("mock-txn")
    expect(result.qrPayload).toContain("000201")
  })

  test("creates payment using per-biller config", async () => {
    global.fetch = mock(async (url: string | URL) => {
      if (String(url).includes("/v1/oauth/token")) {
        return new Response(
          JSON.stringify({
            data: {
              accessToken: "token_abc",
              expiresIn: 900,
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        )
      }

      return new Response(
        JSON.stringify({
          data: {
            transactionId: "txn_123",
            qrRawData: "QR_123",
            deeplinkUrl: "scbeasy://qr/123",
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      )
    }) as unknown as typeof fetch

    const result = await scbProvider.createPayment(makeInput())

    expect(result.success).toBe(true)
    expect(result.providerTransactionId).toBe("txn_123")
    expect(result.qrPayload).toBe("QR_123")
    expect(result.deeplinkUrl).toBe("scbeasy://qr/123")
  })

  test("inquiry maps status", async () => {
    global.fetch = mock(async (url: string | URL) => {
      if (String(url).includes("/v1/oauth/token")) {
        return new Response(
          JSON.stringify({
            data: {
              accessToken: "token_abc",
              expiresIn: 900,
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        )
      }

      return new Response(
        JSON.stringify({
          data: {
            transactionId: "txn_456",
            partnerPaymentId: "piq_1",
            status: "SUCCESS",
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      )
    }) as unknown as typeof fetch

    const input = makeInput()

    const result = await scbProvider.inquirePayment({
      providerReference: "piq_1",
      providerTransactionId: "txn_456",
      billerProfile: input.billerProfile,
    })

    expect(result.providerTransactionId).toBe("txn_456")
    expect(result.providerReference).toBe("piq_1")
    expect(result.status).toBe("SUCCEEDED")
  })
})