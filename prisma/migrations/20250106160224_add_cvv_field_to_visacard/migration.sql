/*
  Warnings:

  - Added the required column `cvv` to the `VisaCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VisaCard" ADD COLUMN     "cvv" TEXT NOT NULL;
