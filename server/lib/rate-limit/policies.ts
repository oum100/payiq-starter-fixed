export type RateLimitScope = "global" | "tenant" | "apiKey";

export type RouteGroup =
  | "payments:create"
  | "apiKeys:list"
  | "apiKeys:create"
  | "apiKeys:rotate"
  | "apiKeys:revoke";

export type RateLimitPolicy = {
  routeGroup: RouteGroup;
  scope: RateLimitScope;
  capacity: number;
  windowSec: number;
};

export const RATE_LIMIT_POLICIES: Record<RouteGroup, RateLimitPolicy[]> = {
  "payments:create": [
    { routeGroup: "payments:create", scope: "global", capacity: 200, windowSec: 60 },
    { routeGroup: "payments:create", scope: "tenant", capacity: 120, windowSec: 60 },
    { routeGroup: "payments:create", scope: "apiKey", capacity: 60, windowSec: 60 },
  ],

  "apiKeys:list": [
    { routeGroup: "apiKeys:list", scope: "global", capacity: 120, windowSec: 60 },
    { routeGroup: "apiKeys:list", scope: "tenant", capacity: 60, windowSec: 60 },
    { routeGroup: "apiKeys:list", scope: "apiKey", capacity: 30, windowSec: 60 },
  ],

  "apiKeys:create": [
    { routeGroup: "apiKeys:create", scope: "global", capacity: 40, windowSec: 60 },
    { routeGroup: "apiKeys:create", scope: "tenant", capacity: 20, windowSec: 60 },
    { routeGroup: "apiKeys:create", scope: "apiKey", capacity: 10, windowSec: 60 },
  ],

  "apiKeys:rotate": [
    { routeGroup: "apiKeys:rotate", scope: "global", capacity: 30, windowSec: 60 },
    { routeGroup: "apiKeys:rotate", scope: "tenant", capacity: 15, windowSec: 60 },
    { routeGroup: "apiKeys:rotate", scope: "apiKey", capacity: 8, windowSec: 60 },
  ],

  "apiKeys:revoke": [
    { routeGroup: "apiKeys:revoke", scope: "global", capacity: 30, windowSec: 60 },
    { routeGroup: "apiKeys:revoke", scope: "tenant", capacity: 15, windowSec: 60 },
    { routeGroup: "apiKeys:revoke", scope: "apiKey", capacity: 8, windowSec: 60 },
  ],
};