import { p as prisma, d as defineEventHandler, q as readRawBody, o as getHeader, t as getQuery, u as getHeaders } from '../../../../../nitro/nitro.mjs';
import { timingSafeEqual, createHash, createHmac } from 'node:crypto';
import { nanoid } from 'nanoid';
import { c as callbackQueue } from '../../../../../_/bullmq.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@prisma/client';
import 'ioredis';
import 'bullmq';

function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}
function hmacSha256(secret, payload) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}
function safeCompare(a, b) {
  if (!a || !b) return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function buildScbCallbackSignature(secret, rawBody) {
  return hmacSha256(secret, rawBody);
}
function verifyScbCallbackSignature(secret, rawBody, incoming) {
  const expected = buildScbCallbackSignature(secret, rawBody);
  return safeCompare(expected, incoming || "");
}

async function storeProviderCallback(params) {
  const dedupeKey = `${params.providerCode}:${params.providerTxnId || params.providerReference || sha256(params.rawBody)}`;
  let callback;
  try {
    callback = await prisma.providerCallback.create({
      data: {
        providerCode: params.providerCode,
        callbackType: "PAYMENT_CALLBACK",
        processStatus: "RECEIVED",
        providerReference: params.providerReference,
        providerTxnId: params.providerTxnId,
        signatureValid: params.signatureValid,
        dedupeKey,
        headers: params.headers,
        queryParams: params.queryParams || {},
        body: params.body,
        rawBodySha256: sha256(params.rawBody)
      }
    });
  } catch {
    return { duplicate: true };
  }
  await callbackQueue.add("provider.callback.process", { providerCallbackId: callback.id }, { jobId: `pcb_${callback.id}_${nanoid(6)}`, removeOnComplete: 1e3, removeOnFail: 1e3 });
  await prisma.providerCallback.update({
    where: { id: callback.id },
    data: { processStatus: "QUEUED", queuedAt: /* @__PURE__ */ new Date() }
  });
  return { duplicate: false, callbackId: callback.id };
}

const callback_post = defineEventHandler(async (event) => {
  var _a, _b;
  const rawBody = await readRawBody(event, "utf8") || "{}";
  const body = JSON.parse(rawBody);
  const incomingSig = getHeader(event, "x-signature") || getHeader(event, "authorization") || "";
  const signatureValid = verifyScbCallbackSignature(process.env.SCB_CALLBACK_SECRET || "", rawBody, incomingSig);
  const result = await storeProviderCallback({
    providerCode: "SCB",
    rawBody,
    body,
    headers: getHeaders(event),
    queryParams: getQuery(event),
    signatureValid,
    providerReference: (body == null ? void 0 : body.partnerPaymentId) || ((_a = body == null ? void 0 : body.data) == null ? void 0 : _a.partnerPaymentId) || null,
    providerTxnId: (body == null ? void 0 : body.transactionId) || ((_b = body == null ? void 0 : body.data) == null ? void 0 : _b.transactionId) || null
  });
  return { received: true, duplicate: result.duplicate };
});

export { callback_post as default };
//# sourceMappingURL=callback.post.mjs.map
