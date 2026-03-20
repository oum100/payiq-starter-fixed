export default defineNuxtConfig({
  compatibilityDate: "2026-03-18",
  modules: [],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    appBaseUrl: process.env.APP_BASE_URL,

    scbApiBaseUrl: process.env.SCB_API_BASE_URL,
    scbClientId: process.env.SCB_CLIENT_ID,
    scbClientSecret: process.env.SCB_CLIENT_SECRET,
    scbCallbackSecret: process.env.SCB_CALLBACK_SECRET,
    
    webhookSecret: process.env.WEBHOOK_SECRET,
    webhookIpAllowlist: process.env.WEBHOOK_IP_ALLOWLIST || "",
    webhookRateLimit: Number(process.env.WEBHOOK_RATE_LIMIT || 100),
  },
  nitro: {
    externals: {
      inline: ["prom-client"],
    },
  },
});
