export type AuthContext = {
  apiKeyId: string
  tenantId: string
  tenantCode: string
  merchantAccountId: string | null
  merchantCode: string | null
  scopes: string[]
}