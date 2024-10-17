/*
  Warnings:

  - Added the required column `gdEconomy` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalEnergyCompensated` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalEnergyConsumed` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWithoutGD` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "gdEconomy" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalEnergyCompensated" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalEnergyConsumed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalWithoutGD" DOUBLE PRECISION NOT NULL;
