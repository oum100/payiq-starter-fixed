import { describe, it, expect } from "bun:test";
import crypto from "node:crypto";

const RUN_E2E = process.env.PAYIQ_RUN_E2E === "1";
const BASE_URL = process.env.PAYIQ_BASE_URL || "http://localhost:3000";
const URL = `${BASE_URL}/api/webhooks/test`;

function sign(ts: number, body: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
}

async function canReachServer(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "OPTIONS" });
    return [200, 204, 404, 405].includes(res.status);
  } catch {
    return false;
  }
}

describe("Webhook E2E", async () => {
  const body = JSON.stringify({ amount: 100 });
  const secret = "test_secret";

  const reachable = RUN_E2E ? await canReachServer(URL) : false;
  const testOrSkip = RUN_E2E && reachable ? it : it.skip;

  testOrSkip("should accept valid webhook", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const sig = sign(ts, body, secret);
    const eventId = `evt_test_valid_${ts}`;

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-payiq-signature": sig,
        "x-payiq-timestamp": String(ts),
        "x-payiq-event-id": eventId,
      },
      body,
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  testOrSkip("should reject invalid signature", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const eventId = `evt_test_invalid_${ts}`;

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-payiq-signature": "invalid",
        "x-payiq-timestamp": String(ts),
        "x-payiq-event-id": eventId,
      },
      body,
    });

    expect(res.status).toBe(400);
  });

  testOrSkip("should detect duplicate event safely", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const eventId = `evt_dup_${ts}`;
    const sig = sign(ts, body, secret);

    const headers = {
      "content-type": "application/json",
      "x-payiq-signature": sig,
      "x-payiq-timestamp": String(ts),
      "x-payiq-event-id": eventId,
    };

    const res1 = await fetch(URL, { method: "POST", headers, body });
    const res2 = await fetch(URL, { method: "POST", headers, body });

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    const json2 = await res2.json();
    expect(json2.ok).toBe(true);
    expect(json2.duplicate).toBe(true);
  });
});