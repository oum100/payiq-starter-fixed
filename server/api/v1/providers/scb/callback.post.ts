import { verifyScbCallbackSignature } from "~/server/services/providers/scb/scb.signature"
import { storeProviderCallback } from "~/server/services/callbacks/storeProviderCallback"

export default defineEventHandler(async (event) => {
  const rawBody = (await readRawBody(event, "utf8")) || "{}"
  const body = JSON.parse(rawBody)
  const incomingSig = getHeader(event, "x-signature") || getHeader(event, "authorization") || ""

  const signatureValid = verifyScbCallbackSignature(process.env.SCB_CALLBACK_SECRET || "", rawBody, incomingSig)

  const result = await storeProviderCallback({
    providerCode: "SCB",
    rawBody,
    body,
    headers: getHeaders(event),
    queryParams: getQuery(event) as Record<string, unknown>,
    signatureValid,
    providerReference: body?.partnerPaymentId || body?.data?.partnerPaymentId || null,
    providerTxnId: body?.transactionId || body?.data?.transactionId || null,
  })

  return { received: true, duplicate: result.duplicate }
})
