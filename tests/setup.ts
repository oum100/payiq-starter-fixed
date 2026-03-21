import { mock } from "bun:test";

process.env.NODE_ENV = "test";
process.env.WEBHOOK_SECRET = "test_secret";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
process.env.WEBHOOK_RATE_LIMIT = "100";
process.env.WEBHOOK_TIMESTAMP_TOLERANCE_SEC = "300";
process.env.WEBHOOK_IP_ALLOWLIST = "";

// อย่า restore module mocks แบบ global ทุก beforeEach/afterEach
// เพราะ test หลายไฟล์พึ่ง top-level mock.module(...) + top-level import
// แล้วจะทำให้ import graph เพี้ยนข้ามไฟล์ได้
//
// ให้แต่ละไฟล์ที่ใช้ mock.module(...) รับผิดชอบ cleanup เองด้วย afterAll(() => mock.restore()).
void mock;