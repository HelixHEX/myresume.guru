/*
  Warnings:

  - Added the required column `name` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ApplicationToResume" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToResume_AB_unique" ON "_ApplicationToResume"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToResume_B_index" ON "_ApplicationToResume"("B");

-- AddForeignKey
ALTER TABLE "_ApplicationToResume" ADD CONSTRAINT "_ApplicationToResume_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToResume" ADD CONSTRAINT "_ApplicationToResume_B_fkey" FOREIGN KEY ("B") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
