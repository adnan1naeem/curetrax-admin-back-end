/*
  Warnings:

  - You are about to drop the column `section` on the `HealthCareProvider` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `Product` table. All the data in the column will be lost.
  - Added the required column `sectionName` to the `HealthCareProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HealthCareProvider" DROP COLUMN "section",
ADD COLUMN     "sectionName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "section",
ADD COLUMN     "sectionName" TEXT NOT NULL;
