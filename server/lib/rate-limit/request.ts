import { createHash } from "node:crypto";
import { getRequestIP, type H3Event } from "h3";

export function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function getClientIp(event: H3Event) {
  return getRequestIP(event, { xForwardedFor: true }) || "unknown";
}

export function getClientIpHash(event: H3Event) {
  return sha256(getClientIp(event));
}