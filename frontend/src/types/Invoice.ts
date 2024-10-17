export interface Invoice {
    id: number;
    customerNumber: string;
    referenceMonth: string;
    energyConsumed: number;
    totalAmount: number;
    energyCompensated: number;
    publicLighting: number;
  }
  