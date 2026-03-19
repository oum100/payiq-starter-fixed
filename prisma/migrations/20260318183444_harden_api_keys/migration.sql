-- AlterTable
ALTER TABLE "api_keys" ADD COLUMN     "environment" TEXT NOT NULL DEFAULT 'test',
ADD COLUMN     "revokedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "api_keys_keyPrefix_idx" ON "api_keys"("keyPrefix");

-- CreateIndex
CREATE INDEX "api_keys_revokedAt_idx" ON "api_keys"("revokedAt");
