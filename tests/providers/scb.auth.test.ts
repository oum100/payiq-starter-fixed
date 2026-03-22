import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test"
import { clearScbTokenCache, getScbAccessToken } from "~/server/services/providers/scb/scb.auth"

const originalFetch = global.fetch

describe("scb.auth", () => {
  beforeEach(() => {
    clearScbTokenCache()
  })

  afterEach(() => {
    global.fetch = originalFetch
    mock.restore()
  })

  test("fetches and caches token", async () => {
    let callCount = 0

    global.fetch = mock(async () => {
      callCount += 1

      return new Response(
        JSON.stringify({
          data: {
            accessToken: "token_123",
            expiresIn: 900,
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      )
    }) as unknown as typeof fetch

    const config = {
      apiBaseUrl: "https://api-sandbox.partners.scb",
      apiKey: "key_1",
      apiSecret: "secret_1",
      billerId: "biller_1",
      merchantId: "merchant_1",
      terminalId: null,
      callbackSecret: null,
      tokenPath: "/v1/oauth/token",
      createQrPath: "/v1/payment/qrcode/create",
      inquiryPath: "/v1/payment/billpayment/inquiry",
      tokenCacheTtlSec: 840,
    }

    const token1 = await getScbAccessToken(config)
    const token2 = await getScbAccessToken(config)

    expect(token1).toBe("token_123")
    expect(token2).toBe("token_123")
    expect(callCount).toBe(1)
  })

  test("throws when accessToken is missing", async () => {
    global.fetch = mock(async () => {
      return new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    }) as unknown as typeof fetch

    const config = {
      apiBaseUrl: "https://api-sandbox.partners.scb",
      apiKey: "key_1",
      apiSecret: "secret_1",
      billerId: "biller_1",
      merchantId: null,
      terminalId: null,
      callbackSecret: null,
      tokenPath: "/v1/oauth/token",
      createQrPath: "/v1/payment/qrcode/create",
      inquiryPath: "/v1/payment/billpayment/inquiry",
      tokenCacheTtlSec: 840,
    }

    await expect(getScbAccessToken(config)).rejects.toThrow(
      "SCB token response missing accessToken",
    )
  })
})