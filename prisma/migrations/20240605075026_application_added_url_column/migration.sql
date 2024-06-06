/*
  Warnings:

  - You are about to drop the column `name` on the `Application` table. All the data in the column will be lost.
  - Added the required column `title` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
