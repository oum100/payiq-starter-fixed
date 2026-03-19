import { hmacSha256, safeCompare } from "~/server/lib/crypto"

export function buildScbCallbackSignature(secret: string, rawBody: string) {
  return hmacSha256(secret, rawBody)
}

export function verifyScbCallbackSignature(secret: string, rawBody: string, incoming?: string | null) {
  const expected = buildScbCallbackSignature(secret, rawBody)
  return safeCompare(expected, incoming || "")
}
