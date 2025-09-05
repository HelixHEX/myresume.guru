-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "platformId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "jobSlug" TEXT,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogo" TEXT,
    "jobIndustry" TEXT[],
    "jobType" TEXT[],
    "jobGeo" TEXT,
    "jobLevel" TEXT,
    "jobExcerpt" TEXT,
    "jobDescription" TEXT,
    "pubDate" TIMESTAMP(3),
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT NOT NULL,
    "salaryPeriod" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
