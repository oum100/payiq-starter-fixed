Rate-limit production-ready patch set

Replace these files in your repo:

- server/lib/rate-limit/types.ts
- server/lib/rate-limit/keys.ts
- server/lib/rate-limit/config.ts
- server/lib/rate-limit/policies.ts
- server/lib/rate-limit/resolve.ts
- server/lib/rate-limit/service.ts
- server/lib/rate-limit/request.ts
- server/lib/rate-limit/script.ts
- server/lib/rate-limit/payment-spam.ts
- server/middleware/10.api-key-auth.ts
- server/middleware/20.rate-limit.ts
- tests/rate-limit/middleware.test.ts
- tests/rate-limit/resolve.test.ts

Notes:
- This set removes the duplicate buildRateLimitKey implementation.
- resolve.ts now returns CheckPolicyInput[] consistently.
- service.ts uses token bucket Lua and fails open if Redis/script errors occur.
- auth abuse and route-based throttling both use the same CheckPolicyInput contract.
