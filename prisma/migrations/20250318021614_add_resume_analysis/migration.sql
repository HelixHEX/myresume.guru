-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "analysis_json" JSONB,
ADD COLUMN     "candidate_email" TEXT,
ADD COLUMN     "candidate_location" TEXT,
ADD COLUMN     "candidate_name" TEXT,
ADD COLUMN     "candidate_phone" TEXT,
ADD COLUMN     "companies_worked" TEXT[],
ADD COLUMN     "education_institutions" TEXT[],
ADD COLUMN     "job_titles" TEXT[],
ADD COLUMN     "technical_skills" TEXT[],
ALTER COLUMN "status" SET DEFAULT 'Not analyzed';

-- CreateIndex
CREATE INDEX "Resume_candidate_name_idx" ON "Resume"("candidate_name");

-- CreateIndex
CREATE INDEX "Resume_candidate_email_idx" ON "Resume"("candidate_email");

-- CreateIndex
CREATE INDEX "Resume_technical_skills_idx" ON "Resume"("technical_skills");

-- CreateIndex
CREATE INDEX "Resume_companies_worked_idx" ON "Resume"("companies_worked");

-- CreateIndex
CREATE INDEX "Resume_job_titles_idx" ON "Resume"("job_titles");
