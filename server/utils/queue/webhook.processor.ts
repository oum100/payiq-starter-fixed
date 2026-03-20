import { prisma } from "~/server/lib/prisma";

type ProcessWebhookInput = {
  provider: string;
  rawBody: string;
  merchantId?: string;
  eventId?: string;
};

type ProviderPayload = Record<string, any>;

function parseRawBody(rawBody: string): ProviderPayload {
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error("invalid JSON payload");
  }
}

async function markProcessedOnce(provider: string, eventId?: string) {
  if (!eventId) return true;

  const record = await prisma.webhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider,
        eventId,
      },
    },
    select: {
      processedAt: true,
    },
  });

  if (record?.processedAt) {
    return false;
  }

  return true;
}

async function handleSCB(data: ProcessWebhookInput, payload: ProviderPayload) {
  const canProcess = await markProcessedOnce(data.provider, data.eventId);
  if (!canProcess) {
    return { ok: true, skipped: true, reason: "already processed" };
  }

  const externalRef =
    payload.transactionId ||
    payload.paymentIntentId ||
    payload.reference ||
    payload.ref ||
    null;

  await prisma.webhookEvent.updateMany({
    where: {
      provider: data.provider,
      ...(data.eventId ? { eventId: data.eventId } : {}),
    },
    data: {
      processedAt: new Date(),
      lastError: null,
    },
  });

  return {
    ok: true,
    provider: "scb",
    externalRef,
    eventType: payload.eventType || payload.status || "unknown",
  };
}

async function handleKBank(data: ProcessWebhookInput, payload: ProviderPayload) {
  const canProcess = await markProcessedOnce(data.provider, data.eventId);
  if (!canProcess) {
    return { ok: true, skipped: true, reason: "already processed" };
  }

  const externalRef =
    payload.transactionId ||
    payload.paymentIntentId ||
    payload.reference ||
    payload.ref ||
    null;

  await prisma.webhookEvent.updateMany({
    where: {
      provider: data.provider,
      ...(data.eventId ? { eventId: data.eventId } : {}),
    },
    data: {
      processedAt: new Date(),
      lastError: null,
    },
  });

  return {
    ok: true,
    provider: "kbank",
    externalRef,
    eventType: payload.eventType || payload.status || "unknown",
  };
}

export async function processWebhook(data: ProcessWebhookInput) {
  const payload = parseRawBody(data.rawBody);

  switch (data.provider) {
    case "scb":
      return handleSCB(data, payload);
    case "kbank":
      return handleKBank(data, payload);
    default:
      throw new Error("unknown provider");
  }
}