export interface InvoiceData {
    energyConsumed: { quantity: number, value: number };
    energySCEE: { quantity: number, value: number };
    energyCompensated: { quantity: number, value: number };
    publicLighting: number;
  }