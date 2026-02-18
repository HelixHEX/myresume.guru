/*
  Warnings:

  - You are about to drop the column `chatId` on the `Resume` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_chatId_fkey";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "chatId",
ADD COLUMN     "chat_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
