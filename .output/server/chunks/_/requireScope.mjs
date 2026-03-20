import { A as AppError } from '../nitro/nitro.mjs';

function requireScope(auth, scope) {
  if (!auth.scopes.includes(scope) && !auth.scopes.includes("*")) {
    throw new AppError("FORBIDDEN", `Missing required scope: ${scope}`, 403);
  }
}

export { requireScope as r };
//# sourceMappingURL=requireScope.mjs.map
