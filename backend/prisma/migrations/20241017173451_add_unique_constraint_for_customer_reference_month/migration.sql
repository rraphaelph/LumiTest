/*
  Warnings:

  - A unique constraint covering the columns `[customerNumber,referenceMonth]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invoice_customerNumber_referenceMonth_key" ON "Invoice"("customerNumber", "referenceMonth");
