/*
  Warnings:

  - A unique constraint covering the columns `[A,B]` on the table `_ApplicationToResume` will be added. If there are existing duplicate values, this will fail.
  - Made the column `A` on table `_ApplicationToResume` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "_ApplicationToResume" ALTER COLUMN "A" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToResume_AB_unique" ON "_ApplicationToResume"("A", "B");
