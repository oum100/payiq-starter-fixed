-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('RECEIVED', 'VERIFIED', 'PROCESSED', 'FAILED', 'DUPLICATE');

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "merchantId" TEXT,
    "payload" TEXT NOT NULL,
    "headersJson" JSONB,
    "status" "WebhookStatus" NOT NULL DEFAULT 'RECEIVED',
    "verifiedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "processingAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_status_idx" ON "WebhookEvent"("provider", "status");

-- CreateIndex
CREATE INDEX "WebhookEvent_merchantId_createdAt_idx" ON "WebhookEvent"("merchantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_eventId_key" ON "WebhookEvent"("provider", "eventId");
