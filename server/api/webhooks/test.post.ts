import { readBody, getHeader, setResponseStatus } from "h3";
import crypto from "node:crypto";

const SECRET = process.env.PAYIQ_WEBHOOK_SECRET || "test_secret";

// memory store (dev only)
const seenEvents = new Set<string>();

function verifySignature(ts: string, body: string, signature: string): boolean {
  try {
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(`${ts}.${body}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expected, "utf8");
    const receivedBuf = Buffer.from(signature, "utf8");

    if (expectedBuf.length !== receivedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  } catch {
    return false;
  }
}

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event);
  const bodyString = JSON.stringify(rawBody);

  const signature = getHeader(event, "x-payiq-signature");
  const timestamp = getHeader(event, "x-payiq-timestamp");
  const eventId = getHeader(event, "x-payiq-event-id");

  if (!signature || !timestamp || !eventId) {
    setResponseStatus(event, 400);
    return { ok: false, error: "missing headers" };
  }

  const valid = verifySignature(timestamp, bodyString, signature);

  if (!valid) {
    setResponseStatus(event, 400);
    return { ok: false, error: "invalid signature" };
  }

  // duplicate check
  if (seenEvents.has(eventId)) {
    return { ok: true, duplicate: true };
  }

  seenEvents.add(eventId);

  // TODO: process webhook จริงตรงนี้
  console.log("[webhook received]", {
    eventId,
    body: rawBody,
  });

  return { ok: true };
});
