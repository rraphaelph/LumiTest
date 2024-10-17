import pdfParse from 'pdf-parse';

export const extractDataFromPDF = async (file:any) => {
  const data = await pdfParse(file);
  const text = data.text;
  const customerNumber = extractCustomerNumber(text);
  const referenceMonth = extractReferenceMonth(text);
  const energyConsumed = extractEnergyConsumed(text);
  const energySCEE = extractEnergySCEE(text);
  const energyCompensated = extractEnergyCompensated(text);  // Extração para energia compensada
  const publicLighting = extractPublicLighting(text);        // Extração para iluminação pública

  return { customerNumber, referenceMonth, energyConsumed, energySCEE, energyCompensated, publicLighting };
};

  const extractCustomerNumber = (text: string): string => {
    // Divide o texto em linhas
    const lines = text.split('\n');

    // Procurar pela linha que contém "Nº DO CLIENTE"
    const customerLineIndex = lines.findIndex(line => line.includes('Nº DO CLIENTE'));

    // Se "Nº DO CLIENTE" for encontrado, pegue o número na linha logo abaixo
    if (customerLineIndex !== -1 && lines[customerLineIndex + 1]) {
      const customerNumber = lines[customerLineIndex + 1].trim().split(/\s+/)[0]; // Pega o primeiro valor da linha
      console.log('Número do cliente:', customerNumber);
      return customerNumber;
    }

    throw new Error('Customer number not found');
  };

  const extractReferenceMonth = (text: string): string => {
    // Divide o texto em linhas
    const lines = text.split('\n');

    // Procura a linha que contém "Referente a"
    const referenceLineIndex = lines.findIndex(line => line.includes('Referente a'));

    // Verifica se encontrou a linha e captura a linha seguinte que contém o mês de referência
    if (referenceLineIndex !== -1 && lines[referenceLineIndex + 1]) {
      const nextLine = lines[referenceLineIndex + 1].trim();

      // Captura o mês e o ano (ex: SET/2024)
      const match = nextLine.match(/([A-Z]{3})\/(\d{4})/i);
      if (match && match[0]) {
        console.log('Mês de referência:', match[0]);
        return match[0]; // Retorna o mês de referência (ex: SET/2024)
      }
    }

    throw new Error('Reference month not found');
  };

  const extractEnergyConsumed = (text: string): { quantity: number, value: number } => {
    // Ajusta a expressão regular para capturar a quantidade e o valor de Energia Elétrica
    const match = text.match(/Energia ElétricakWh\s+(\d+(\.\d+)?)\s+[\d,.]+\s+(\d+,\d{2})/);
  
    if (match && match[1] && match[3]) {
      const quantity = parseFloat(match[1]); // Captura a quantidade
      const value = parseFloat(match[3].replace(',', '.')); // Captura o valor, substituindo vírgula por ponto
      console.log('Consumo de energia:', { quantity, value });
      return { quantity, value }; // Retorna quantidade e valor
    }
  
    throw new Error('Energy consumed not found');
  };
  
  const extractEnergySCEE = (text: string): { quantity: number, value: number } => {
    // Ajusta a expressão regular para capturar a quantidade e o valor de Energia SCEE s/ ICMS
    const match = text.match(/Energia SCEE s\/ ICMSkWh\s+(\d+[\.,]?\d*)\s+[\d.,]+\s+([\d.,]+)/);
  
    if (match && match[1] && match[2]) {
      const quantity = parseFloat(match[1].replace(',', '.')); // Captura a quantidade
      const value = parseFloat(match[2].replace(',', '.')); // Captura o valor
      console.log('Energia SCEE s/ ICMS:', { quantity, value });
      return { quantity, value }; // Retorna quantidade e valor
    }
  
    throw new Error('Energy SCEE not found');
  };
  
  const extractEnergyCompensated = (text: string): { quantity: number, value: number } => {
    // Ajusta a expressão regular para capturar a quantidade e o valor de Energia Compensada GD I
    const match = text.match(/Energia compensada GD IkWh\s+(\d+[\.,]?\d*)\s+[\d.,]+\s+(-?\d+[\.,]\d{2})/);
  
    if (match && match[1] && match[2]) {
      const quantity = parseFloat(match[1].replace(',', '.')); // Captura a quantidade
      const value = parseFloat(match[2].replace(',', '.')); // Captura o valor
      console.log('Energia compensada GD I:', { quantity, value });
      return { quantity, value }; // Retorna quantidade e valor
    }
  
    throw new Error('Energy compensated not found');
  };
  
  const extractPublicLighting = (text: string): number => {
    // Ajusta a expressão regular para capturar o valor de Contribuição para Iluminação Pública
    const match = text.match(/Contrib Ilum Publica Municipal\s+(\d+,\d{2})/);
  
    if (match && match[1]) {
      const publicLighting = parseFloat(match[1].replace(',', '.'));
      console.log('Contribuição Iluminação Pública:', publicLighting);
      return publicLighting;
    }
  
    throw new Error('Public lighting contribution not found');
  };
  
  