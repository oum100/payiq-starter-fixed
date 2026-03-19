# PayIQ Starter Fixed

ชุดนี้แก้ปัญหา baseline เดิม โดยเพิ่ม `docker-compose.yml` สำหรับ PostgreSQL + Redis ให้รันได้ทันที

## Quick Start

```bash
cp .env.example .env
bun run db:up
bun install
bun run prisma:generate
bun run prisma:migrate
bun run seed
bun run dev
```

เปิดอีก terminal:

```bash
bun run workers
```

## Test API

### Create payment intent

```bash
curl -X POST http://localhost:3000/api/v1/payment-intents \
  -H "content-type: application/json" \
  -H "idempotency-key: demo-key-001" \
  -d '{
    "tenantCode": "demo",
    "merchantCode": "default",
    "merchantOrderId": "ORD-1001",
    "merchantReference": "INV-8899",
    "amount": "20.00",
    "currency": "THB",
    "paymentMethodType": "PROMPTPAY_QR",
    "customerName": "Tuu"
  }'
```

### Read payment intent

```bash
curl http://localhost:3000/api/v1/payment-intents/<publicId>
```

### Simulate SCB callback

```bash
curl -X POST http://localhost:3000/api/v1/providers/scb/callback \
  -H "content-type: application/json" \
  -H "x-signature: dummy" \
  -d '{
    "partnerPaymentId": "<publicId>",
    "transactionId": "scb-demo-txn-001",
    "status": "SUCCESS"
  }'
```

## Notes

- `SCB_API_BASE_URL` เป็น sandbox placeholder
- adapter เป็น skeleton พร้อมต่อกับสเปกจริง
- webhook endpoint ใน seed ใช้ `https://example.com/payiq/webhook` เป็น demo
