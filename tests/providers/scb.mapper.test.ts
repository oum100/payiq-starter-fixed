import { describe, expect, test } from "bun:test"
import {
  getScbResponseCode,
  mapScbCreateResponse,
  mapScbInquiryResponse,
  mapScbStatusToInternal,
} from "~/server/services/providers/scb/scb.mapper"

describe("scb.mapper", () => {
  test("maps statuses", () => {
    expect(mapScbStatusToInternal("SUCCESS")).toBe("SUCCEEDED")
    expect(mapScbStatusToInternal("PENDING")).toBe("PENDING")
    expect(mapScbStatusToInternal("EXPIRED")).toBe("EXPIRED")
    expect(mapScbStatusToInternal("UNKNOWN")).toBe("FAILED")
  })

  test("extracts response code", () => {
    expect(getScbResponseCode({ status: { code: 1000 } })).toBe("1000")
    expect(getScbResponseCode({ statusCode: "4001" })).toBe("4001")
  })

  test("maps create response", () => {
    const result = mapScbCreateResponse({
      request: {
        partnerPaymentId: "piq_1",
        partnerOrderId: "ord_1",
        amount: 20,
        currency: "THB",
        billerId: "biller_1",
        callbackUrl: "https://example.com/callback",
      },
      response: {
        data: {
          transactionId: "txn_1",
          qrRawData: "QRDATA",
          deeplinkUrl: "scbeasy://pay",
        },
      },
      ok: true,
      rawRequest: { hello: "world" },
      rawResponse: { ok: true },
    })

    expect(result.success).toBe(true)
    expect(result.providerTransactionId).toBe("txn_1")
    expect(result.qrPayload).toBe("QRDATA")
    expect(result.deeplinkUrl).toBe("scbeasy://pay")
  })

  test("maps inquiry response", () => {
    const result = mapScbInquiryResponse({
      request: {
        transactionId: "txn_2",
        partnerPaymentId: "piq_2",
        billerId: "biller_1",
      },
      response: {
        data: {
          transactionId: "txn_2",
          partnerPaymentId: "piq_2",
          status: "SUCCESS",
        },
      },
      rawResponse: { ok: true },
    })

    expect(result.providerTransactionId).toBe("txn_2")
    expect(result.providerReference).toBe("piq_2")
    expect(result.status).toBe("SUCCEEDED")
  })
})