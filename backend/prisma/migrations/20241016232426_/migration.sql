/*
  Warnings:

  - You are about to drop the column `energyCompensated` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `energyConsumed` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `energySCEE` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "energyCompensated",
DROP COLUMN "energyConsumed",
DROP COLUMN "energySCEE",
ADD COLUMN     "energyCompensatedQty" DOUBLE PRECISION,
ADD COLUMN     "energyCompensatedVal" DOUBLE PRECISION,
ADD COLUMN     "energyConsumedQty" DOUBLE PRECISION,
ADD COLUMN     "energyConsumedVal" DOUBLE PRECISION,
ADD COLUMN     "energySCEEQty" DOUBLE PRECISION,
ADD COLUMN     "energySCEEVal" DOUBLE PRECISION;
