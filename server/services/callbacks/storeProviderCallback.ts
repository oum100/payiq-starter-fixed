import { nanoid } from "nanoid";
import { prisma } from "~/server/lib/prisma";
import { callbackQueue } from "~/server/lib/bullmq";
import { sha256 } from "~/server/lib/crypto";

export async function storeProviderCallback(params: {
  providerCode: "SCB";
  rawBody: string;
  body: unknown;
  headers: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
  signatureValid?: boolean | null;
  providerReference?: string | null;
  providerTxnId?: string | null;
}) {
  const dedupeKey = `${params.providerCode}:${
    params.providerTxnId ?? params.providerReference ?? sha256(params.rawBody)
  }`;

  let callback;

  try {
    callback = await prisma.providerCallback.create({
      data: {
        providerCode: params.providerCode,
        callbackType: "PAYMENT_CALLBACK",
        processStatus: "RECEIVED",

        // 🔥 FIX exactOptional
        providerReference: params.providerReference ?? null,
        providerTxnId: params.providerTxnId ?? null,
        signatureValid: params.signatureValid ?? null,

        dedupeKey,
        headers: params.headers as any,
        queryParams: (params.queryParams ?? {}) as any,
        body: params.body as any,
        rawBodySha256: sha256(params.rawBody),
      },
    });
  } catch {
    return { duplicate: true };
  }

  await callbackQueue.add(
    "provider.callback.process",
    { providerCallbackId: callback.id },
    {
      jobId: `pcb_${callback.id}_${nanoid(6)}`,
      removeOnComplete: 1000,
      removeOnFail: 1000,
    },
  );

  await prisma.providerCallback.update({
    where: { id: callback.id },
    data: {
      processStatus: "QUEUED",
      queuedAt: new Date(),
    },
  });

  return { duplicate: false, callbackId: callback.id };
}
