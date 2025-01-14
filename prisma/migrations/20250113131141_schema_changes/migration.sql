/*
  Warnings:

  - You are about to drop the column `section` on the `Timeline` table. All the data in the column will be lost.
  - Added the required column `sectionName` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "section",
ADD COLUMN     "sectionName" TEXT NOT NULL;
