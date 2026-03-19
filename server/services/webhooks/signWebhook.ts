import { hmacSha256 } from "~/server/lib/crypto"

export function signWebhook(secret: string, payload: string) {
  return hmacSha256(secret, payload)
}
