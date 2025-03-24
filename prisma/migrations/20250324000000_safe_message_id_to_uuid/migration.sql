-- First, add the new UUID column
ALTER TABLE "Message" ADD COLUMN "new_id" TEXT;

-- Generate UUIDs for existing records
UPDATE "Message" SET "new_id" = gen_random_uuid()::TEXT;

-- Make the new_id column NOT NULL
ALTER TABLE "Message" ALTER COLUMN "new_id" SET NOT NULL;

-- Drop the primary key constraint from the old id column
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey";

-- Add primary key constraint to the new_id column
ALTER TABLE "Message" ADD PRIMARY KEY ("new_id");

-- Drop the old id column
ALTER TABLE "Message" DROP COLUMN "id";

-- Rename new_id to id
ALTER TABLE "Message" RENAME COLUMN "new_id" TO "id"; 