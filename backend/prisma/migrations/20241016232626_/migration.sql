/*
  Warnings:

  - Made the column `energyCompensatedQty` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `energyCompensatedVal` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `energyConsumedQty` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `energyConsumedVal` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `energySCEEQty` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `energySCEEVal` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "energyCompensatedQty" SET NOT NULL,
ALTER COLUMN "energyCompensatedVal" SET NOT NULL,
ALTER COLUMN "energyConsumedQty" SET NOT NULL,
ALTER COLUMN "energyConsumedVal" SET NOT NULL,
ALTER COLUMN "energySCEEQty" SET NOT NULL,
ALTER COLUMN "energySCEEVal" SET NOT NULL;
