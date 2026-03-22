import { mapScbStatusToInternal } from "./scb.mapper";

type UnknownRecord = Record<string, unknown>;

export type NormalizedScbCallback = {
  body: unknown;
  enrichedBody: unknown;
  providerReference: string | null;
  providerTxnId: string | null;
  externalStatus: string | null;
  normalizedStatus: "PENDING" | "SUCCEEDED" | "FAILED" | "EXPIRED" | null;
  eventId: string | null;
  signatureHeader: string;
};

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function pickFirstString(values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function parseJsonBody(rawBody: string): unknown {
  if (!rawBody.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return {
      _rawBody: rawBody,
      _invalidJson: true,
    };
  }
}

export function extractScbSignatureHeader(
  headers: Record<string, unknown>,
): string {
  return (
    pickFirstString([
      headers["x-signature"],
      headers["X-Signature"],
      headers.authorization,
      headers.Authorization,
    ]) || ""
  );
}

export function normalizeScbCallback(args: {
  rawBody: string;
  headers: Record<string, unknown>;
}): NormalizedScbCallback {
  const parsedBody = parseJsonBody(args.rawBody);
  const bodyRecord = asRecord(parsedBody);
  const dataRecord = asRecord(bodyRecord?.data);

  const providerReference = pickFirstString([
    bodyRecord?.partnerPaymentId,
    bodyRecord?.partnerPaymentID,
    dataRecord?.partnerPaymentId,
    dataRecord?.partnerPaymentID,
  ]);

  const providerTxnId = pickFirstString([
    bodyRecord?.transactionId,
    bodyRecord?.transactionID,
    bodyRecord?.txnId,
    dataRecord?.transactionId,
    dataRecord?.transactionID,
    dataRecord?.txnId,
  ]);

  const externalStatus = pickFirstString([
    bodyRecord?.status,
    bodyRecord?.paymentStatus,
    bodyRecord?.statusText,
    dataRecord?.status,
    dataRecord?.paymentStatus,
    dataRecord?.statusText,
  ]);

  const eventId = pickFirstString([
    args.headers["x-event-id"],
    args.headers["X-Event-Id"],
    args.headers["x-correlation-id"],
    args.headers["X-Correlation-Id"],
    bodyRecord?.eventId,
    bodyRecord?.eventID,
    dataRecord?.eventId,
    dataRecord?.eventID,
    providerTxnId,
    providerReference,
  ]);

  const normalizedStatus = externalStatus
    ? mapScbStatusToInternal(externalStatus)
    : null;

  const signatureHeader = extractScbSignatureHeader(args.headers);

  const normalizedPayload = {
    providerReference,
    providerTxnId,
    externalStatus,
    normalizedStatus,
    eventId,
    signatureHeaderPresent: Boolean(signatureHeader),
  };

  const enrichedBody =
    bodyRecord !== null
      ? {
          ...bodyRecord,
          _normalized: normalizedPayload,
        }
      : {
          originalBody: parsedBody,
          _normalized: normalizedPayload,
        };

  return {
    body: parsedBody,
    enrichedBody,
    providerReference,
    providerTxnId,
    externalStatus,
    normalizedStatus,
    eventId,
    signatureHeader,
  };
}
