export type AuthContext = {
  apiKeyId: string;
  apiKeyPrefix: string;
  tenantId: string;
  tenantCode: string;
  merchantAccountId: string | null;
  merchantCode: string | null;
  scopes: string[];
};
