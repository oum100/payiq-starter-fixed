export function buildPaymentSpamKey(...parts: string[]): string {
  return `abuse:pay:v1:${parts.join(":")}`;
}

export function buildTempBlockKey(subject: string, identifier: string): string {
  return `block:v1:${subject}:${identifier}`;
}
