/*
  Warnings:

  - You are about to drop the column `resources_list` on the `ActionableFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `time_estimate` on the `ActionableFeedback` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Resume_candidate_email_idx";

-- DropIndex
DROP INDEX "Resume_candidate_name_idx";

-- DropIndex
DROP INDEX "Resume_companies_worked_idx";

-- DropIndex
DROP INDEX "Resume_job_titles_idx";

-- DropIndex
DROP INDEX "Resume_technical_skills_idx";

-- AlterTable
ALTER TABLE "ActionableFeedback" DROP COLUMN "resources_list",
DROP COLUMN "time_estimate";

-- CreateTable
CREATE TABLE "Improvement" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "resumeId" INTEGER NOT NULL,

    CONSTRAINT "Improvement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Improvement" ADD CONSTRAINT "Improvement_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
