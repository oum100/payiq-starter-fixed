-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "MerchantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "ProviderCode" AS ENUM ('SCB', 'KBANK', 'PROMPTPAY', 'INTERNAL');

-- CreateEnum
CREATE TYPE "BillerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('PROMPTPAY_QR', 'DEEPLINK', 'BILL_PAYMENT', 'CARD', 'BANK_TRANSFER', 'E_WALLET');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('THB');

-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('CREATED', 'ROUTING', 'PENDING_PROVIDER', 'AWAITING_CUSTOMER', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REVERSED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentEventType" AS ENUM ('PAYMENT_CREATED', 'ROUTE_RESOLVED', 'PROVIDER_REQUESTED', 'PROVIDER_ACCEPTED', 'PROVIDER_REJECTED', 'PROVIDER_CALLBACK_RECEIVED', 'PROVIDER_CALLBACK_PROCESSED', 'PAYMENT_PENDING', 'PAYMENT_SUCCEEDED', 'PAYMENT_FAILED', 'PAYMENT_CANCELLED', 'PAYMENT_EXPIRED', 'PAYMENT_REVERSED', 'PAYMENT_REFUNDED', 'WEBHOOK_QUEUED', 'WEBHOOK_DELIVERED', 'WEBHOOK_FAILED', 'RECONCILIATION_REQUESTED', 'RECONCILIATION_MATCHED', 'RECONCILIATION_MISMATCH', 'MANUAL_NOTE');

-- CreateEnum
CREATE TYPE "ProviderAttemptType" AS ENUM ('CREATE_PAYMENT', 'CREATE_QR', 'INQUIRY', 'CANCEL', 'REFUND', 'CALLBACK_PROCESS', 'TOKEN_REFRESH');

-- CreateEnum
CREATE TYPE "ProviderAttemptStatus" AS ENUM ('PENDING', 'SENT', 'ACKNOWLEDGED', 'SUCCEEDED', 'FAILED', 'TIMEOUT');

-- CreateEnum
CREATE TYPE "CallbackProcessStatus" AS ENUM ('RECEIVED', 'QUEUED', 'PROCESSING', 'PROCESSED', 'DUPLICATE', 'FAILED', 'IGNORED');

-- CreateEnum
CREATE TYPE "WebhookEndpointStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'DELIVERED', 'FAILED', 'RETRYING', 'DEAD');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDING', 'MATCHED', 'MISMATCH', 'CORRECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('SYSTEM', 'API_KEY', 'USER', 'WORKER', 'PROVIDER');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ArchiveKind" AS ENUM ('PROVIDER_REQUEST', 'PROVIDER_RESPONSE', 'PROVIDER_CALLBACK', 'MERCHANT_WEBHOOK_REQUEST', 'MERCHANT_WEBHOOK_RESPONSE', 'API_REQUEST', 'API_RESPONSE');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
    "defaultCurrency" "CurrencyCode" NOT NULL DEFAULT 'THB',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_accounts" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "MerchantStatus" NOT NULL DEFAULT 'ACTIVE',
    "callbackBaseUrl" TEXT,
    "contactEmail" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "merchantAccountId" TEXT,
    "keyPrefix" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "MerchantStatus" NOT NULL DEFAULT 'ACTIVE',
    "scopes" TEXT[],
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biller_profiles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "providerCode" "ProviderCode" NOT NULL,
    "billerId" TEXT,
    "merchantIdAtProvider" TEXT,
    "status" "BillerStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "credentialsEncrypted" JSONB NOT NULL,
    "config" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "biller_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_routes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "paymentMethodType" "PaymentMethodType" NOT NULL,
    "providerCode" "ProviderCode" NOT NULL,
    "billerProfileId" TEXT NOT NULL,
    "currency" "CurrencyCode" NOT NULL DEFAULT 'THB',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "status" "RouteStatus" NOT NULL DEFAULT 'ACTIVE',
    "rules" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_intents" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "merchantAccountId" TEXT,
    "paymentRouteId" TEXT,
    "billerProfileId" TEXT,
    "publicId" TEXT NOT NULL,
    "merchantOrderId" TEXT,
    "merchantReference" TEXT,
    "idempotencyKeyValue" TEXT,
    "paymentMethodType" "PaymentMethodType" NOT NULL,
    "providerCode" "ProviderCode",
    "currency" "CurrencyCode" NOT NULL DEFAULT 'THB',
    "amount" DECIMAL(18,2) NOT NULL,
    "feeAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'CREATED',
    "providerReference" TEXT,
    "providerTransactionId" TEXT,
    "providerQrRef" TEXT,
    "qrPayload" TEXT,
    "deeplinkUrl" TEXT,
    "redirectUrl" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "succeededAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "lastReconciledAt" TIMESTAMP(3),
    "metadata" JSONB,
    "extra" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "type" "PaymentEventType" NOT NULL,
    "fromStatus" "PaymentIntentStatus",
    "toStatus" "PaymentIntentStatus",
    "summary" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_attempts" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "billerProfileId" TEXT NOT NULL,
    "type" "ProviderAttemptType" NOT NULL,
    "status" "ProviderAttemptStatus" NOT NULL DEFAULT 'PENDING',
    "requestId" TEXT NOT NULL,
    "idempotencyKeySent" TEXT,
    "providerCode" "ProviderCode" NOT NULL,
    "providerEndpoint" TEXT,
    "httpMethod" TEXT,
    "httpStatusCode" INTEGER,
    "requestHeaders" JSONB,
    "requestBody" JSONB,
    "responseHeaders" JSONB,
    "responseBody" JSONB,
    "providerReference" TEXT,
    "providerTxnId" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_callbacks" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "billerProfileId" TEXT,
    "providerCode" "ProviderCode" NOT NULL,
    "callbackType" TEXT,
    "processStatus" "CallbackProcessStatus" NOT NULL DEFAULT 'RECEIVED',
    "providerReference" TEXT,
    "providerTxnId" TEXT,
    "signatureValid" BOOLEAN,
    "dedupeKey" TEXT,
    "headers" JSONB,
    "queryParams" JSONB,
    "body" JSONB,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queuedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "rawBodySha256" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_callbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoints" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "merchantAccountId" TEXT,
    "code" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "status" "WebhookEndpointStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscribedEvents" TEXT[],
    "timeoutMs" INTEGER NOT NULL DEFAULT 10000,
    "maxAttempts" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "webhookEndpointId" TEXT NOT NULL,
    "eventType" "PaymentEventType" NOT NULL,
    "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attemptNumber" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "lastErrorAt" TIMESTAMP(3),
    "requestHeaders" JSONB,
    "requestBody" JSONB,
    "responseStatusCode" INTEGER,
    "responseHeaders" JSONB,
    "responseBody" JSONB,
    "signature" TEXT,
    "idempotencyKey" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliation_records" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "billerProfileId" TEXT NOT NULL,
    "status" "ReconciliationStatus" NOT NULL DEFAULT 'PENDING',
    "inquiryAttemptCount" INTEGER NOT NULL DEFAULT 0,
    "providerReference" TEXT,
    "providerTxnId" TEXT,
    "providerSnapshot" JSONB,
    "internalSnapshot" JSONB,
    "mismatchReason" TEXT,
    "correctionApplied" BOOLEAN NOT NULL DEFAULT false,
    "correctionNote" TEXT,
    "checkedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reconciliation_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "requestPath" TEXT NOT NULL,
    "requestMethod" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "responseStatusCode" INTEGER,
    "responseBody" JSONB,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "lockedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "actorType" "AuditActorType" NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
    "message" TEXT,
    "metadata" JSONB,
    "requestId" TEXT,
    "traceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payload_archives" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "providerAttemptId" TEXT,
    "providerCallbackId" TEXT,
    "webhookDeliveryId" TEXT,
    "kind" "ArchiveKind" NOT NULL,
    "storageDriver" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "contentType" TEXT,
    "sha256" TEXT,
    "byteSize" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payload_archives_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_code_key" ON "tenants"("code");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE INDEX "merchant_accounts_tenantId_status_idx" ON "merchant_accounts"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_accounts_tenantId_code_key" ON "merchant_accounts"("tenantId", "code");

-- CreateIndex
CREATE INDEX "api_keys_tenantId_merchantAccountId_status_idx" ON "api_keys"("tenantId", "merchantAccountId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_tenantId_keyPrefix_key" ON "api_keys"("tenantId", "keyPrefix");

-- CreateIndex
CREATE INDEX "biller_profiles_tenantId_providerCode_status_idx" ON "biller_profiles"("tenantId", "providerCode", "status");

-- CreateIndex
CREATE INDEX "biller_profiles_tenantId_billerId_idx" ON "biller_profiles"("tenantId", "billerId");

-- CreateIndex
CREATE UNIQUE INDEX "biller_profiles_tenantId_code_key" ON "biller_profiles"("tenantId", "code");

-- CreateIndex
CREATE INDEX "payment_routes_tenantId_paymentMethodType_currency_status_p_idx" ON "payment_routes"("tenantId", "paymentMethodType", "currency", "status", "priority");

-- CreateIndex
CREATE INDEX "payment_routes_tenantId_providerCode_status_idx" ON "payment_routes"("tenantId", "providerCode", "status");

-- CreateIndex
CREATE INDEX "payment_routes_billerProfileId_idx" ON "payment_routes"("billerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_routes_tenantId_code_key" ON "payment_routes"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_publicId_key" ON "payment_intents"("publicId");

-- CreateIndex
CREATE INDEX "payment_intents_tenantId_status_createdAt_idx" ON "payment_intents"("tenantId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "payment_intents_tenantId_paymentMethodType_status_createdAt_idx" ON "payment_intents"("tenantId", "paymentMethodType", "status", "createdAt");

-- CreateIndex
CREATE INDEX "payment_intents_tenantId_merchantReference_idx" ON "payment_intents"("tenantId", "merchantReference");

-- CreateIndex
CREATE INDEX "payment_intents_tenantId_providerReference_idx" ON "payment_intents"("tenantId", "providerReference");

-- CreateIndex
CREATE INDEX "payment_intents_tenantId_providerTransactionId_idx" ON "payment_intents"("tenantId", "providerTransactionId");

-- CreateIndex
CREATE INDEX "payment_intents_merchantAccountId_createdAt_idx" ON "payment_intents"("merchantAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "payment_intents_billerProfileId_createdAt_idx" ON "payment_intents"("billerProfileId", "createdAt");

-- CreateIndex
CREATE INDEX "payment_intents_expiresAt_idx" ON "payment_intents"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_tenantId_merchantOrderId_key" ON "payment_intents"("tenantId", "merchantOrderId");

-- CreateIndex
CREATE INDEX "payment_events_paymentIntentId_createdAt_idx" ON "payment_events"("paymentIntentId", "createdAt");

-- CreateIndex
CREATE INDEX "payment_events_type_createdAt_idx" ON "payment_events"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "provider_attempts_requestId_key" ON "provider_attempts"("requestId");

-- CreateIndex
CREATE INDEX "provider_attempts_paymentIntentId_createdAt_idx" ON "provider_attempts"("paymentIntentId", "createdAt");

-- CreateIndex
CREATE INDEX "provider_attempts_billerProfileId_type_createdAt_idx" ON "provider_attempts"("billerProfileId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "provider_attempts_providerCode_type_status_createdAt_idx" ON "provider_attempts"("providerCode", "type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "provider_attempts_providerReference_idx" ON "provider_attempts"("providerReference");

-- CreateIndex
CREATE INDEX "provider_attempts_providerTxnId_idx" ON "provider_attempts"("providerTxnId");

-- CreateIndex
CREATE INDEX "provider_callbacks_paymentIntentId_receivedAt_idx" ON "provider_callbacks"("paymentIntentId", "receivedAt");

-- CreateIndex
CREATE INDEX "provider_callbacks_billerProfileId_receivedAt_idx" ON "provider_callbacks"("billerProfileId", "receivedAt");

-- CreateIndex
CREATE INDEX "provider_callbacks_providerCode_processStatus_receivedAt_idx" ON "provider_callbacks"("providerCode", "processStatus", "receivedAt");

-- CreateIndex
CREATE INDEX "provider_callbacks_providerReference_idx" ON "provider_callbacks"("providerReference");

-- CreateIndex
CREATE INDEX "provider_callbacks_providerTxnId_idx" ON "provider_callbacks"("providerTxnId");

-- CreateIndex
CREATE UNIQUE INDEX "provider_callbacks_providerCode_dedupeKey_key" ON "provider_callbacks"("providerCode", "dedupeKey");

-- CreateIndex
CREATE INDEX "webhook_endpoints_tenantId_status_idx" ON "webhook_endpoints"("tenantId", "status");

-- CreateIndex
CREATE INDEX "webhook_endpoints_merchantAccountId_status_idx" ON "webhook_endpoints"("merchantAccountId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_endpoints_tenantId_code_key" ON "webhook_endpoints"("tenantId", "code");

-- CreateIndex
CREATE INDEX "webhook_deliveries_paymentIntentId_createdAt_idx" ON "webhook_deliveries"("paymentIntentId", "createdAt");

-- CreateIndex
CREATE INDEX "webhook_deliveries_webhookEndpointId_status_nextAttemptAt_idx" ON "webhook_deliveries"("webhookEndpointId", "status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "webhook_deliveries_status_nextAttemptAt_idx" ON "webhook_deliveries"("status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "reconciliation_records_paymentIntentId_createdAt_idx" ON "reconciliation_records"("paymentIntentId", "createdAt");

-- CreateIndex
CREATE INDEX "reconciliation_records_billerProfileId_status_createdAt_idx" ON "reconciliation_records"("billerProfileId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "reconciliation_records_status_createdAt_idx" ON "reconciliation_records"("status", "createdAt");

-- CreateIndex
CREATE INDEX "idempotency_keys_tenantId_requestPath_requestMethod_idx" ON "idempotency_keys"("tenantId", "requestPath", "requestMethod");

-- CreateIndex
CREATE INDEX "idempotency_keys_expiresAt_idx" ON "idempotency_keys"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_tenantId_key_key" ON "idempotency_keys"("tenantId", "key");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_createdAt_idx" ON "audit_logs"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_createdAt_idx" ON "audit_logs"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_requestId_idx" ON "audit_logs"("requestId");

-- CreateIndex
CREATE INDEX "audit_logs_traceId_idx" ON "audit_logs"("traceId");

-- CreateIndex
CREATE INDEX "payload_archives_paymentIntentId_kind_createdAt_idx" ON "payload_archives"("paymentIntentId", "kind", "createdAt");

-- CreateIndex
CREATE INDEX "payload_archives_providerAttemptId_idx" ON "payload_archives"("providerAttemptId");

-- CreateIndex
CREATE INDEX "payload_archives_providerCallbackId_idx" ON "payload_archives"("providerCallbackId");

-- CreateIndex
CREATE INDEX "payload_archives_webhookDeliveryId_idx" ON "payload_archives"("webhookDeliveryId");

-- CreateIndex
CREATE INDEX "payload_archives_storageDriver_storageKey_idx" ON "payload_archives"("storageDriver", "storageKey");

-- AddForeignKey
ALTER TABLE "merchant_accounts" ADD CONSTRAINT "merchant_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_merchantAccountId_fkey" FOREIGN KEY ("merchantAccountId") REFERENCES "merchant_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biller_profiles" ADD CONSTRAINT "biller_profiles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_routes" ADD CONSTRAINT "payment_routes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_routes" ADD CONSTRAINT "payment_routes_billerProfileId_fkey" FOREIGN KEY ("billerProfileId") REFERENCES "biller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_merchantAccountId_fkey" FOREIGN KEY ("merchantAccountId") REFERENCES "merchant_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_paymentRouteId_fkey" FOREIGN KEY ("paymentRouteId") REFERENCES "payment_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_billerProfileId_fkey" FOREIGN KEY ("billerProfileId") REFERENCES "biller_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "payment_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_attempts" ADD CONSTRAINT "provider_attempts_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "payment_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_attempts" ADD CONSTRAINT "provider_attempts_billerProfileId_fkey" FOREIGN KEY ("billerProfileId") REFERENCES "biller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_callbacks" ADD CONSTRAINT "provider_callbacks_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "payment_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_callbacks" ADD CONSTRAINT "provider_callbacks_billerProfileId_fkey" FOREIGN KEY ("billerProfileId") REFERENCES "biller_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_merchantAccountId_fkey" FOREIGN KEY ("merchantAccountId") REFERENCES "merchant_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "payment_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_webhookEndpointId_fkey" FOREIGN KEY ("webhookEndpointId") REFERENCES "webhook_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_records" ADD CONSTRAINT "reconciliation_records_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "payment_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliation_records" ADD CONSTRAINT "reconciliation_records_billerProfileId_fkey" FOREIGN KEY ("billerProfileId") REFERENCES "biller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "idempotency_keys_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payload_archives" ADD CONSTRAINT "payload_archives_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "payment_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payload_archives" ADD CONSTRAINT "payload_archives_providerAttemptId_fkey" FOREIGN KEY ("providerAttemptId") REFERENCES "provider_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payload_archives" ADD CONSTRAINT "payload_archives_providerCallbackId_fkey" FOREIGN KEY ("providerCallbackId") REFERENCES "provider_callbacks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payload_archives" ADD CONSTRAINT "payload_archives_webhookDeliveryId_fkey" FOREIGN KEY ("webhookDeliveryId") REFERENCES "webhook_deliveries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
