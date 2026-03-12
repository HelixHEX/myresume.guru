-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reference_id" TEXT,
    "metadata" JSONB,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiUsage" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "chat_id" INTEGER,
    "message_id" TEXT,
    "model" TEXT NOT NULL,
    "input_tokens" INTEGER NOT NULL,
    "cached_input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL,
    "cost_usd" DECIMAL(12,6) NOT NULL,
    "credits_deducted" INTEGER NOT NULL,
    "request_id" TEXT,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditTransaction_user_id_created_at_idx" ON "CreditTransaction"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "CreditTransaction_reference_id_idx" ON "CreditTransaction"("reference_id");

-- CreateIndex
CREATE INDEX "AiUsage_user_id_created_at_idx" ON "AiUsage"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "AiUsage_request_id_idx" ON "AiUsage"("request_id");
