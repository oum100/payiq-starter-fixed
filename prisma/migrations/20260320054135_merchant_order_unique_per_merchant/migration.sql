/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,merchantAccountId,merchantOrderId]` on the table `payment_intents` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payment_intents_tenantId_merchantOrderId_key";

-- CreateIndex
CREATE UNIQUE INDEX "payment_intents_tenantId_merchantAccountId_merchantOrderId_key" ON "payment_intents"("tenantId", "merchantAccountId", "merchantOrderId");
