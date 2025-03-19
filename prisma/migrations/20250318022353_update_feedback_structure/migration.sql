-- AlterTable
ALTER TABLE "ActionableFeedback" ADD COLUMN     "difficulty_level" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "resources_list" JSONB,
ADD COLUMN     "steps_list" JSONB,
ADD COLUMN     "time_estimate" TEXT;

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "impact" TEXT,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "section" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'improvement';

-- CreateIndex
CREATE INDEX "ActionableFeedback_status_idx" ON "ActionableFeedback"("status");

-- CreateIndex
CREATE INDEX "ActionableFeedback_priority_idx" ON "ActionableFeedback"("priority");

-- CreateIndex
CREATE INDEX "ActionableFeedback_difficulty_level_idx" ON "ActionableFeedback"("difficulty_level");

-- CreateIndex
CREATE INDEX "Feedback_type_idx" ON "Feedback"("type");

-- CreateIndex
CREATE INDEX "Feedback_priority_idx" ON "Feedback"("priority");

-- CreateIndex
CREATE INDEX "Feedback_section_idx" ON "Feedback"("section");

-- CreateIndex
CREATE INDEX "Feedback_status_idx" ON "Feedback"("status");
