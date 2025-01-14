/*
  Warnings:

  - The `pagename` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PageName" AS ENUM ('allo', 'car19');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "pagename",
ADD COLUMN     "pagename" "PageName" NOT NULL DEFAULT 'allo';
