export function checkIpAllowlist(ip: string) {
  const allowlist = process.env.WEBHOOK_IP_ALLOWLIST;

  if (!allowlist) return;

  const allowed = allowlist.split(",");

  if (!allowed.includes(ip)) {
    throw new Error("ip not allowed");
  }
}