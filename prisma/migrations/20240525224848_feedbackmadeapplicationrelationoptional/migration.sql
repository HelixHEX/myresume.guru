-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_applicationId_fkey";

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "applicationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
