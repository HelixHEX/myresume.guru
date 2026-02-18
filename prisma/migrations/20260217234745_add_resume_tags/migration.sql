-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
