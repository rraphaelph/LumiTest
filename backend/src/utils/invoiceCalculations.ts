import { InvoiceData } from "../types/InvoiceData";

export const calculateAggregatedValues = (invoiceData: InvoiceData) => {
    const totalEnergyConsumed = invoiceData.energyConsumed.quantity + invoiceData.energySCEE.quantity;
    const totalEnergyCompensated = invoiceData.energyCompensated.quantity;
    const totalWithoutGD = invoiceData.energyConsumed.value + invoiceData.energySCEE.value + invoiceData.publicLighting;
    const gdEconomy = invoiceData.energyCompensated.value;
  
    return {
      totalEnergyConsumed,
      totalEnergyCompensated,
      totalWithoutGD,
      gdEconomy,
    };
  };