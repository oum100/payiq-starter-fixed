import type { ProviderCode } from "@prisma/client"
import type { PaymentProvider } from "./base/PaymentProvider"
import { scbProvider } from "./scb/scb.adapter"

export function getProviderAdapter(providerCode: ProviderCode): PaymentProvider {
  switch (providerCode) {
    case "SCB":
      return scbProvider
    default:
      throw new Error(`Unsupported provider: ${providerCode}`)
  }
}
