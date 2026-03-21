import { beforeAll, describe, expect, it } from "bun:test";
import crypto from "node:crypto";

const RUN_E2E = process.env.PAYIQ_RUN_E2E === "1";
const BASE_URL = (
  process.env.PAYIQ_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");
const WEBHOOK_PATH = process.env.PAYIQ_WEBHOOK_PATH || "/api/webhooks/test";
const URL = `${BASE_URL}${WEBHOOK_PATH}`;
const SHARED_SECRET = process.env.PAYIQ_WEBHOOK_SECRET || "test_secret";

function sign(ts: number, body: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`${ts}.${body}`)
    .digest("hex");
}

async function canReachServer(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "OPTIONS" });
    return [200, 204, 400, 404, 405].includes(res.status);
  } catch {
    return false;
  }
}

function makeHeaders(
  ts: number,
  eventId: string,
  signature: string,
): HeadersInit {
  return {
    "content-type": "application/json",
    "x-payiq-signature": signature,
    "x-payiq-timestamp": String(ts),
    "x-payiq-event-id": eventId,
  };
}

function uniqueEventId(prefix: string): string {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

let reachable = false;

describe("Webhook E2E", () => {
  const body = JSON.stringify({ amount: 100 });

  beforeAll(async () => {
    reachable = RUN_E2E ? await canReachServer(URL) : false;
  });

  const runOrSkip = (name: string, fn: () => Promise<void>) => {
    return it(name, async () => {
      if (!RUN_E2E) {
        console.warn(
          `[Webhook E2E] skipped "${name}" because PAYIQ_RUN_E2E is not set to 1`,
        );
        return;
      }

      if (!reachable) {
        console.warn(
          `[Webhook E2E] skipped "${name}" because server is not reachable at ${URL}`,
        );
        return;
      }

      await fn();
    });
  };

  runOrSkip("should accept valid webhook", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const eventId = uniqueEventId("evt_test_valid");
    const sig = sign(ts, body, SHARED_SECRET);

    const res = await fetch(URL, {
      method: "POST",
      headers: makeHeaders(ts, eventId, sig),
      body,
    });

    expect(res.status).toBe(200);

    const json = (await res.json()) as {
      ok?: boolean;
      duplicate?: boolean;
    };

    expect(json.ok).toBe(true);
    expect(json.duplicate ?? false).toBe(false);
  });

  runOrSkip("should reject invalid signature", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const eventId = uniqueEventId("evt_test_invalid");

    const res = await fetch(URL, {
      method: "POST",
      headers: makeHeaders(ts, eventId, "invalid"),
      body,
    });

    expect(res.status).toBe(400);
  });

  runOrSkip("should detect duplicate event safely", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const eventId = uniqueEventId("evt_dup");
    const sig = sign(ts, body, SHARED_SECRET);
    const headers = makeHeaders(ts, eventId, sig);

    const res1 = await fetch(URL, {
      method: "POST",
      headers,
      body,
    });

    const res2 = await fetch(URL, {
      method: "POST",
      headers,
      body,
    });

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    const json1 = (await res1.json()) as {
      ok?: boolean;
      duplicate?: boolean;
    };
    const json2 = (await res2.json()) as {
      ok?: boolean;
      duplicate?: boolean;
    };

    expect(json1.ok).toBe(true);
    expect(json1.duplicate ?? false).toBe(false);

    expect(json2.ok).toBe(true);
    expect(json2.duplicate).toBe(true);
  });
});
