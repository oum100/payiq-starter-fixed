declare module "h3" {
  interface H3EventContext {
    auth?: {
      apiKeyId: string;
      tenantId: string | null;
      merchantAccountId: string | null;
      scopes: string[];
      apiKeyPrefix: string;
    };
  }
}

export {};