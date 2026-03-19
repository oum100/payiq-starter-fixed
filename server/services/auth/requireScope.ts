import { AppError } from "~/server/lib/errors"
import type { AuthContext } from "~/server/types/auth"

export function requireScope(auth: AuthContext, scope: string) {
  if (!auth.scopes.includes(scope) && !auth.scopes.includes("*")) {
    throw new AppError("FORBIDDEN", `Missing required scope: ${scope}`, 403)
  }
}