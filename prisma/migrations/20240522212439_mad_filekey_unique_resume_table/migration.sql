/*
  Warnings:

  - A unique constraint covering the columns `[fileKey]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fileKey` on table `Resume` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "fileKey" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Resume_fileKey_key" ON "Resume"("fileKey");
