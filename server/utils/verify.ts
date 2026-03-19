import crypto from "crypto";

const TOLERANCE = 300; // seconds

function timingSafeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
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

  const now = Math.floor(Date.now() / 1000);
  const ts = Number(timestamp);

  if (Math.abs(now - ts) > TOLERANCE) {
    throw new Error("timestamp out of tolerance");
  }

  const secrets = getSecrets(merchantId);

  const payload = `${timestamp}.${rawBody}`;

  const valid = secrets.some((secret) => {
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return timingSafeEqual(hmac, signature);
  });

  if (!valid) {
    throw new Error("invalid signature");
  }
}

// 🔑 support rotation
function getSecrets(merchantId?: string): string[] {
  const global = process.env.WEBHOOK_SECRET?.split(",") || [];

  // future: load per merchant secret from DB
  return global;
}