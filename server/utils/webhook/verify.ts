import crypto from "node:crypto";

const TOLERANCE = Number(process.env.WEBHOOK_TIMESTAMP_TOLERANCE_SEC || 300);

function timingSafeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function verifyWebhookSignature({
  rawBody,
  signature,
  timestamp,
  merchantId,
}: {
  rawBody: string;
  signature: string;
  timestamp: string;
  merchantId?: string;
}) {
  if (!signature || !timestamp) {
    throw new Error("missing signature");
  }

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) {
    throw new Error("invalid timestamp");
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > TOLERANCE) {
    throw new Error("timestamp out of tolerance");
  }

  const secrets = getSecrets(merchantId);

  if (!secrets.length) {
    throw new Error("webhook secret is not configured");
  }

  const payload = `${timestamp}.${rawBody}`;

  const matched = secrets.some((secret) => {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return timingSafeEqual(expected, signature);
  });

  if (!matched) {
    throw new Error("invalid signature");
  }
}

function getSecrets(_merchantId?: string): string[] {
  return (process.env.WEBHOOK_SECRET || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}