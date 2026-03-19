# PayIQ Webhook Hardening

## Signature

HMAC SHA256

payload:
timestamp.rawBody

header:
- x-payiq-signature
- x-payiq-timestamp
- x-payiq-event-id

---

## Generate Signature

echo -n "timestamp.body" | openssl dgst -sha256 -hmac "secret"

---

## ENV

WEBHOOK_SECRET=secret1,secret2
WEBHOOK_IP_ALLOWLIST=1.1.1.1,2.2.2.2
WEBHOOK_RATE_LIMIT=100
REDIS_URL=redis://localhost:6379

---

## Flow

1. Verify IP
2. Rate limit
3. Verify signature
4. Check timestamp tolerance (300s)
5. Deduplicate event
6. Store event
7. Async process

---

## Status

- RECEIVED
- VERIFIED
- PROCESSED
- FAILED
- DUPLICATE

---

## Test

### VALID

TS=$(date +%s)
BODY='{"amount":100}'
SIG=$(echo -n "$TS.$BODY" | openssl dgst -sha256 -hmac "secret" | sed 's/^.* //')

curl -X POST http://localhost:3000/api/webhooks/test \
-H "x-payiq-signature: $SIG" \
-H "x-payiq-timestamp: $TS" \
-H "x-payiq-event-id: evt_001" \
-d "$BODY"

---

### INVALID SIGNATURE

-H "x-payiq-signature: invalid"

---

### REPLAY

Use timestamp older than 300 seconds

---

### DUPLICATE

Send same eventId again
