import { describe, expect, test } from "bun:test"
import { getScbConfig, isScbMockMode } from "~/server/services/providers/scb/scb.config"

describe("scb.config", () => {
  test("parses config from billerProfile.config", () => {
    const config = getScbConfig({
      id: "bp_1",
      providerCode: "SCB",
      billerId: null,
      merchantIdAtProvider: null,
      credentialsEncrypted: {},
      config: {
        apiBaseUrl: "https://api-sandbox.partners.scb/",
        apiKey: "key_123",
        apiSecret: "secret_123",
        billerId: "biller_123",
        merchantId: "merchant_123",
        terminalId: "term_123",
      },
    })

    expect(config.apiBaseUrl).toBe("https://api-sandbox.partners.scb")
    expect(config.apiKey).toBe("key_123")
    expect(config.apiSecret).toBe("secret_123")
    expect(config.billerId).toBe("biller_123")
    expect(config.merchantId).toBe("merchant_123")
    expect(config.terminalId).toBe("term_123")
  })

  test("falls back to top-level fields", () => {
    const config = getScbConfig({
      id: "bp_2",
      providerCode: "SCB",
      billerId: "biller_top",
      merchantIdAtProvider: "merchant_top",
      credentialsEncrypted: {},
      config: {
        apiKey: "key_456",
        apiSecret: "secret_456",
      },
    })

    expect(config.billerId).toBe("biller_top")
    expect(config.merchantId).toBe("merchant_top")
  })

  test("detects mock mode from config", () => {
    expect(
      isScbMockMode({
        id: "bp_3",
        providerCode: "SCB",
        billerId: null,
        merchantIdAtProvider: null,
        credentialsEncrypted: {},
        config: { mock: true },
      }),
    ).toBe(true)
  })

  test("throws when required config is missing", () => {
    expect(() =>
      getScbConfig({
        id: "bp_4",
        providerCode: "SCB",
        billerId: null,
        merchantIdAtProvider: null,
        credentialsEncrypted: {},
        config: {},
      }),
    ).toThrow("missing required config")
  })
})