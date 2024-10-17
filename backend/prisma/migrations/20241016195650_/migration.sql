-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "customerNumber" TEXT NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "energyConsumed" DOUBLE PRECISION NOT NULL,
    "energyCompensated" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "publicLighting" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
