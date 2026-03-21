import { createError, setResponseHeader, type H3Event } from "h3";
import { redis } from "../redis";
import { PAYMENT_SPAM_LIMITS } from "./config";
import { buildPaymentSpamKey, buildTempBlockKey } from "./keys";
import { getClientIpHash, sha256 } from "./request";

interface PaymentSpamInput {
  merchantAccountId: string;
  amount: string;
  currency: string;
  reference?: string | null;
}

export async function checkPaymentSpamOrThrow(
  event: H3Event,
  input: PaymentSpamInput,
): Promise<void> {
  const ipHash = getClientIpHash(event);

  const blockedKey = buildTempBlockKey(
    "payment-spam",
    `${input.merchantAccountId}:${ipHash}`,
  );

  const blockedTtl = await redis.ttl(blockedKey);
  if (blockedTtl > 0) {
    setResponseHeader(event, "Retry-After", blockedTtl);

    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_BLOCKED",
        retryAfterSec: blockedTtl,
      },
    });
  }

  const referenceHash = sha256(input.reference?.trim() || "no-ref");
  const amountKey = `${input.amount}:${input.currency}`;

  const duplicateRefKey = buildPaymentSpamKey(
    "dupref",
    input.merchantAccountId,
    referenceHash,
    amountKey,
  );

  const velocityKey = buildPaymentSpamKey(
    "velocity",
    input.merchantAccountId,
    ipHash,
    amountKey,
  );

  const multi = redis.multi();
  multi.incr(duplicateRefKey);
  multi.expire(duplicateRefKey, PAYMENT_SPAM_LIMITS.duplicateReference.ttlSec);
  multi.incr(velocityKey);
  multi.expire(velocityKey, PAYMENT_SPAM_LIMITS.amountVelocity.ttlSec);

  const results = await multi.exec();
  const duplicateCount = Number(results?.[0]?.[1] ?? 0);
  const velocityCount = Number(results?.[2]?.[1] ?? 0);

  if (duplicateCount > PAYMENT_SPAM_LIMITS.duplicateReference.threshold) {
    await redis.set(
      blockedKey,
      "1",
      "EX",
      PAYMENT_SPAM_LIMITS.duplicateReference.blockSec,
    );

    setResponseHeader(
      event,
      "Retry-After",
      PAYMENT_SPAM_LIMITS.duplicateReference.blockSec,
    );

    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_DUPLICATE_REFERENCE",
        retryAfterSec: PAYMENT_SPAM_LIMITS.duplicateReference.blockSec,
      },
    });
  }

  if (velocityCount > PAYMENT_SPAM_LIMITS.amountVelocity.threshold) {
    await redis.set(
      blockedKey,
      "1",
      "EX",
      PAYMENT_SPAM_LIMITS.amountVelocity.blockSec,
    );

    setResponseHeader(
      event,
      "Retry-After",
      PAYMENT_SPAM_LIMITS.amountVelocity.blockSec,
    );

    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_AMOUNT_VELOCITY",
        retryAfterSec: PAYMENT_SPAM_LIMITS.amountVelocity.blockSec,
      },
    });
  }
}
