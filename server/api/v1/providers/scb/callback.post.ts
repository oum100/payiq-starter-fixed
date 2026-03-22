import { storeProviderCallback } from "~/server/services/callbacks/storeProviderCallback"
import { verifyScbCallbackSignature } from "~/server/services/providers/scb/scb.signature"
import { normalizeScbCallback } from "~/server/services/providers/scb/scb.webhook"

export default defineEventHandler(async (event) => {
  const rawBody = (await readRawBody(event, "utf8")) || "{}"
  const headers = getHeaders(event)
  const normalized = normalizeScbCallback({
    rawBody,
    headers,
  })

  const signatureValid = verifyScbCallbackSignature(
    process.env.SCB_CALLBACK_SECRET || "",
    rawBody,
    normalized.signatureHeader,
  )

  const result = await storeProviderCallback({
    providerCode: "SCB",
    rawBody,
    body: normalized.enrichedBody,
    headers,
    queryParams: {
      ...(getQuery(event) as Record<string, unknown>),
      _normalized: {
        externalStatus: normalized.externalStatus,
        normalizedStatus: normalized.normalizedStatus,
        eventId: normalized.eventId,
      },
    },
    signatureValid,
    providerReference: normalized.providerReference,
    providerTxnId: normalized.providerTxnId,
  })

  return {
    received: true,
    duplicate: result.duplicate,
  }
})