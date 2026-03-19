import { prisma } from "../server/lib/prisma"
import { createApiKey } from "../server/services/auth/createApiKey"

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { code: "demo" },
    update: {},
    create: {
      code: "demo",
      name: "Demo Tenant",
    },
  })

  const merchant = await prisma.merchantAccount.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant.id,
        code: "default",
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      code: "default",
      name: "Default Merchant",
    },
  })

  const biller = await prisma.billerProfile.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant.id,
        code: "scb-main",
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      code: "scb-main",
      displayName: "SCB Main Biller",
      providerCode: "SCB",
      billerId: "123456789012345",
      credentialsEncrypted: {
        clientId: process.env.SCB_CLIENT_ID,
        clientSecret: process.env.SCB_CLIENT_SECRET,
      },
    },
  })

  await prisma.paymentRoute.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant.id,
        code: "promptpay-qr-default",
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      code: "promptpay-qr-default",
      paymentMethodType: "PROMPTPAY_QR",
      providerCode: "SCB",
      billerProfileId: biller.id,
      currency: "THB",
      isDefault: true,
      priority: 1,
    },
  })

  await prisma.webhookEndpoint.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant.id,
        code: "merchant-default",
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      merchantAccountId: merchant.id,
      code: "merchant-default",
      url: "https://example.com/payiq/webhook",
      secretHash: "merchant-webhook-secret",
      subscribedEvents: ["PAYMENT_SUCCEEDED", "PAYMENT_FAILED"],
    },
  })

  const existingKeys = await prisma.apiKey.findMany({
    where: {
      tenantId: tenant.id,
      merchantAccountId: merchant.id,
    },
    take: 1,
  })

  if (existingKeys.length === 0) {
    const key = await createApiKey({
      tenantCode: tenant.code,
      merchantCode: merchant.code,
      name: "Default Merchant API Key",
      scopes: ["payments:create", "payments:read", "api_keys:manage"],
      environment: "test",
    })

    console.log("Seed completed")
    console.log("IMPORTANT: save this API key now, it will not be shown again:")
    console.log(key.fullKey)
  } else {
    console.log("Seed completed")
    console.log("API key already exists; create a new one via API if needed.")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })