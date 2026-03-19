export function buildRateLimitKey(
  scope: string,
  identifier: string,
  routeGroup: string,
) {
  return `rl:tb:v2:${scope}:${identifier}:${routeGroup}`;
}

export function buildPaymentSpamKey(...parts: string[]) {
  return `abuse:pay:v1:${parts.join(":")}`;
}

export function buildTempBlockKey(subject: string, identifier: string) {
  return `block:v1:${subject}:${identifier}`;
}