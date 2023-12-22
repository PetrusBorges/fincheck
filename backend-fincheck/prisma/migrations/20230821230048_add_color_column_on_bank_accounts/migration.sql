/*
  Warnings:

  - Added the required column `color` to the `bank_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bank_accounts" ADD COLUMN     "color" TEXT NOT NULL;
