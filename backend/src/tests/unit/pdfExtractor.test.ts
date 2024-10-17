import { extractDataFromPDF } from '../../utils/pdfExtractor';
import pdfParse from 'pdf-parse';

// Mockando a função pdfParse
jest.mock('pdf-parse', () => jest.fn());

describe('Teste de extração de dados de PDF', () => {
  it('extrai dados corretamente de um PDF simulado', async () => {
    const mockPdfText = `
      Nº DO CLIENTE
      123456789
      Referente a
      JAN/2024
      Energia ElétricakWh 500 1,02822940 51,40
      Energia SCEE s/ ICMSkWh 300 0,56219971 229,92
      Energia compensada GD IkWh 200 0,53071000 -217,06
      Contrib Ilum Publica Municipal 55,04
    `;

    // Mock da resposta do pdfParse
    (pdfParse as jest.Mock).mockResolvedValue({ text: mockPdfText });

    const result = await extractDataFromPDF(Buffer.from('dummy pdf data'));

    // Verificando se os dados extraídos estão corretos
    expect(result.customerNumber).toBe('123456789');
    expect(result.referenceMonth).toBe('JAN/2024');
    expect(result.energyConsumed.quantity).toBe(500);
    expect(result.energyConsumed.value).toBe(51.40);
    expect(result.energySCEE.quantity).toBe(300);
    expect(result.energySCEE.value).toBe(229.92);
    expect(result.energyCompensated.quantity).toBe(200);
    expect(result.energyCompensated.value).toBe(-217.06);
    expect(result.publicLighting).toBe(55.04);
  });
});
