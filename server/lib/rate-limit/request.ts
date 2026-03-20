import type { H3Event } from "h3";
import { createHash } from "node:crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function getClientIp(event: H3Event): string {
  const forwarded = event.node.req.headers["x-forwarded-for"];

  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0]!.trim();
  }

  const realIp = event.node.req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }

  return event.node.req.socket.remoteAddress || "unknown";
}

export function getClientIpHash(event: H3Event): string {
  return sha256(getClientIp(event));
}
