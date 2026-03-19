import { createHash, randomBytes, timingSafeEqual } from "node:crypto"

export function generateApiKeySecret(bytes = 24): string {
  return randomBytes(bytes).toString("base64url")
}

export function hashApiKeySecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex")
}

export function verifyApiKeySecret(secret: string, secretHash: string): boolean {
  const hashed = hashApiKeySecret(secret)
  const a = Buffer.from(hashed)
  const b = Buffer.from(secretHash)

  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function generateKeyPrefix(environment: "test" | "live" = "test"): string {
  const rand = randomBytes(6).toString("hex")
  return environment === "live" ? `pk_live_${rand}` : `pk_test_${rand}`
}

export function buildFullApiKey(keyPrefix: string, secret: string): string {
  return `${keyPrefix}.${secret}`
}

export function splitFullApiKey(fullKey: string): { keyPrefix: string; secret: string } | null {
  const parts = fullKey.split(".")
  if (parts.length !== 2) return null

  const [keyPrefix, secret] = parts
  if (!keyPrefix || !secret) return null

  return { keyPrefix, secret }
}