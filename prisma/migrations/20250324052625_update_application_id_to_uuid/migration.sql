/*
  Warnings:

  - The primary key for the `Application` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ActionableFeedback" DROP CONSTRAINT "ActionableFeedback_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationScore" DROP CONSTRAINT "ApplicationScore_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "_ApplicationToResume" DROP CONSTRAINT "_ApplicationToResume_A_fkey";

-- AlterTable
ALTER TABLE "ActionableFeedback" ALTER COLUMN "applicationId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Application" DROP CONSTRAINT "Application_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Application_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Application_id_seq";

-- AlterTable
ALTER TABLE "ApplicationScore" ALTER COLUMN "applicationId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "applicationId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "applicationId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ApplicationToResume" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationScore" ADD CONSTRAINT "ApplicationScore_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionableFeedback" ADD CONSTRAINT "ActionableFeedback_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToResume" ADD CONSTRAINT "_ApplicationToResume_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 1: Add a new UUID column
ALTER TABLE "Application" ADD COLUMN "new_id" TEXT;

-- Step 2: Generate UUIDs for existing records
UPDATE "Application" SET "new_id" = gen_random_uuid()::TEXT;

-- Step 3: Update foreign key references in other tables
-- First create new columns
ALTER TABLE "Feedback" ADD COLUMN "new_applicationId" TEXT;
ALTER TABLE "ApplicationScore" ADD COLUMN "new_applicationId" TEXT;
ALTER TABLE "ActionableFeedback" ADD COLUMN "new_applicationId" TEXT;
ALTER TABLE "Message" ADD COLUMN "new_applicationId" TEXT;
ALTER TABLE "_ApplicationToResume" ADD COLUMN "new_A" TEXT;

-- Update the new columns with corresponding UUIDs
UPDATE "Feedback" f
SET "new_applicationId" = a."new_id"
FROM "Application" a
WHERE f."applicationId" = a.id;

UPDATE "ApplicationScore" as_
SET "new_applicationId" = a."new_id"
FROM "Application" a
WHERE as_."applicationId" = a.id;

UPDATE "ActionableFeedback" af
SET "new_applicationId" = a."new_id"
FROM "Application" a
WHERE af."applicationId" = a.id;

UPDATE "Message" m
SET "new_applicationId" = a."new_id"
FROM "Application" a
WHERE m."applicationId" = a.id;

UPDATE "_ApplicationToResume" ar
SET "new_A" = a."new_id"
FROM "Application" a
WHERE ar."A" = a.id::text;

-- Drop old foreign key constraints
ALTER TABLE "Feedback" DROP CONSTRAINT IF EXISTS "Feedback_applicationId_fkey";
ALTER TABLE "ApplicationScore" DROP CONSTRAINT IF EXISTS "ApplicationScore_applicationId_fkey";
ALTER TABLE "ActionableFeedback" DROP CONSTRAINT IF EXISTS "ActionableFeedback_applicationId_fkey";
ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "Message_applicationId_fkey";
ALTER TABLE "_ApplicationToResume" DROP CONSTRAINT IF EXISTS "_ApplicationToResume_A_fkey";

-- Drop old columns
ALTER TABLE "Feedback" DROP COLUMN "applicationId";
ALTER TABLE "ApplicationScore" DROP COLUMN "applicationId";
ALTER TABLE "ActionableFeedback" DROP COLUMN "applicationId";
ALTER TABLE "Message" DROP COLUMN "applicationId";
ALTER TABLE "_ApplicationToResume" DROP COLUMN "A";

-- Rename new columns
ALTER TABLE "Feedback" RENAME COLUMN "new_applicationId" TO "applicationId";
ALTER TABLE "ApplicationScore" RENAME COLUMN "new_applicationId" TO "applicationId";
ALTER TABLE "ActionableFeedback" RENAME COLUMN "new_applicationId" TO "applicationId";
ALTER TABLE "Message" RENAME COLUMN "new_applicationId" TO "applicationId";
ALTER TABLE "_ApplicationToResume" RENAME COLUMN "new_A" TO "A";

-- Step 4: Switch primary key
ALTER TABLE "Application" DROP CONSTRAINT "Application_pkey" CASCADE;
ALTER TABLE "Application" DROP COLUMN "id";
ALTER TABLE "Application" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "Application" ADD PRIMARY KEY ("id");

-- Step 5: Add new foreign key constraints
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ApplicationScore" ADD CONSTRAINT "ApplicationScore_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ActionableFeedback" ADD CONSTRAINT "ActionableFeedback_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "_ApplicationToResume" ADD CONSTRAINT "_ApplicationToResume_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
