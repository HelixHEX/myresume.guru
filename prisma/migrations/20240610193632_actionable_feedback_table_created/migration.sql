-- CreateTable
CREATE TABLE "ActionableFeedback" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not-done',
    "feedbackId" INTEGER,
    "applicationId" INTEGER,
    "resumeId" INTEGER,

    CONSTRAINT "ActionableFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActionableFeedback" ADD CONSTRAINT "ActionableFeedback_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionableFeedback" ADD CONSTRAINT "ActionableFeedback_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionableFeedback" ADD CONSTRAINT "ActionableFeedback_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
