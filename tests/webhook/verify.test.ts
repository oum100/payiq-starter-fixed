import { describe, it, expect } from "bun:test";
import crypto from "node:crypto";
import { verifyWebhookSignature } from "~/server/utils/webhook/verify";

function sign(ts: number, body: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${ts}.${body}`)
    .digest("hex");
}

describe("Webhook Signature", () => {
  const body = JSON.stringify({ amount: 100 });
  const secret = "test_secret";

  it("should verify valid signature", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const sig = sign(ts, body, secret);

    await expect(
      verifyWebhookSignature({
        rawBody: body,
        signature: sig,
        timestamp: String(ts),
      }),
    ).resolves.toBeUndefined();
  });

  it("should reject invalid signature", async () => {
    const ts = Math.floor(Date.now() / 1000);

    await expect(
      verifyWebhookSignature({
        rawBody: body,
        signature: "invalid",
        timestamp: String(ts),
      }),
    ).rejects.toThrow("invalid signature");
  });

  it("should reject replay attack", async () => {
    const ts = Math.floor(Date.now() / 1000) - 1000;
    const sig = sign(ts, body, secret);

    await expect(
      verifyWebhookSignature({
        rawBody: body,
        signature: sig,
        timestamp: String(ts),
      }),
    ).rejects.toThrow("timestamp");
  });

  it("should reject missing signature header", async () => {
    const ts = Math.floor(Date.now() / 1000);

    await expect(
      verifyWebhookSignature({
        rawBody: body,
        signature: "",
        timestamp: String(ts),
      }),
    ).rejects.toThrow("missing signature");
  });
});