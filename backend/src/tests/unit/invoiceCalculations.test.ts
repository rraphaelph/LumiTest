import { calculateAggregatedValues } from '../../utils/invoiceCalculations';
import { InvoiceData } from '../../types/InvoiceData';

describe('Cálculo correto dos valores agregados', () => {
  test('Deve calcular corretamente o consumo de energia elétrica, energia compensada, valor total sem GD e economia GD', () => {
    const invoiceData: InvoiceData = {
      energyConsumed: { quantity: 50, value: 47.92 },
      energySCEE: { quantity: 476, value: 229.66 },
      energyCompensated: { quantity: 449, value: -218.81 },
      publicLighting: 49.43,
    };

    const aggregatedValues = calculateAggregatedValues(invoiceData);

    expect(aggregatedValues.totalEnergyConsumed).toBe(50 + 476);
    expect(aggregatedValues.totalEnergyCompensated).toBe(449);
    expect(aggregatedValues.totalWithoutGD).toBe(47.92 + 229.66 + 49.43);
    expect(aggregatedValues.gdEconomy).toBe(-218.81);
  });
});
