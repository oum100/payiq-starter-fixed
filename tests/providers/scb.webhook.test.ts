import { describe, expect, test } from "bun:test";
import {
  extractScbSignatureHeader,
  normalizeScbCallback,
} from "~/server/services/providers/scb/scb.webhook";

describe("scb.webhook", () => {
  test("extracts signature header from x-signature", () => {
    const signature = extractScbSignatureHeader({
      "x-signature": "sig_123",
    });

    expect(signature).toBe("sig_123");
  });

  test("extracts signature header from authorization fallback", () => {
    const signature = extractScbSignatureHeader({
      authorization: "Bearer abc",
    });

    expect(signature).toBe("Bearer abc");
  });

  test("normalizes flat callback payload", () => {
    const normalized = normalizeScbCallback({
      rawBody: JSON.stringify({
        partnerPaymentId: "piq_001",
        transactionId: "txn_001",
        status: "SUCCESS",
      }),
      headers: {
        "x-signature": "sig_001",
      },
    });

    expect(normalized.providerReference).toBe("piq_001");
    expect(normalized.providerTxnId).toBe("txn_001");
    expect(normalized.externalStatus).toBe("SUCCESS");
    expect(normalized.normalizedStatus).toBe("SUCCEEDED");
    expect(normalized.eventId).toBe("txn_001");
    expect(normalized.signatureHeader).toBe("sig_001");

    const enriched = normalized.enrichedBody as Record<string, unknown>;
    expect(enriched._normalized).toBeDefined();
  });

  test("normalizes nested callback payload", () => {
    const normalized = normalizeScbCallback({
      rawBody: JSON.stringify({
        data: {
          partnerPaymentId: "piq_002",
          transactionId: "txn_002",
          status: "PENDING",
          eventId: "evt_002",
        },
      }),
      headers: {},
    });

    expect(normalized.providerReference).toBe("piq_002");
    expect(normalized.providerTxnId).toBe("txn_002");
    expect(normalized.externalStatus).toBe("PENDING");
    expect(normalized.normalizedStatus).toBe("PENDING");
    expect(normalized.eventId).toBe("evt_002");
  });

  test("falls back eventId from headers before txn/ref", () => {
    const normalized = normalizeScbCallback({
      rawBody: JSON.stringify({
        partnerPaymentId: "piq_003",
        transactionId: "txn_003",
        status: "EXPIRED",
      }),
      headers: {
        "x-event-id": "evt_hdr_003",
      },
    });

    expect(normalized.eventId).toBe("evt_hdr_003");
    expect(normalized.normalizedStatus).toBe("EXPIRED");
  });

  test("handles invalid json safely", () => {
    const normalized = normalizeScbCallback({
      rawBody: "{invalid-json",
      headers: {},
    });

    expect(normalized.providerReference).toBeNull();
    expect(normalized.providerTxnId).toBeNull();
    expect(normalized.externalStatus).toBeNull();
    expect(normalized.normalizedStatus).toBeNull();

    const enriched = normalized.enrichedBody as Record<string, unknown>;
    expect(enriched._normalized).toBeDefined();
  });
});
