process.env.NODE_ENV = "test";
process.env.WEBHOOK_SECRET = "test_secret";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
process.env.WEBHOOK_RATE_LIMIT = "100";
process.env.WEBHOOK_TIMESTAMP_TOLERANCE_SEC = "300";
process.env.WEBHOOK_IP_ALLOWLIST = "";