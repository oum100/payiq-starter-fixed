import { createHash, createHmac, timingSafeEqual } from "node:crypto"

export function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex")
}

export function hmacSha256(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest("hex")
}

export function safeCompare(a?: string | null, b?: string | null) {
  if (!a || !b) return false
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}
