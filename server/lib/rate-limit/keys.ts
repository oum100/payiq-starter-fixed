export function buildRateLimitKey(
  scope: string,
  identifier: string,
  routeGroup: string,
) {
  return `rl:tb:v1:${scope}:${identifier}:${routeGroup}`;
}