import request from 'supertest';
import app from '../../index'; // Ajuste o caminho para a exportação correta do app
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

describe('Testes de Integração de Faturas', () => {
  beforeAll(async () => {
    // Limpa o banco de dados antes de rodar os testes
    await prisma.invoice.deleteMany({});
  });

  afterAll(async () => {
    // Fechar a conexão do Prisma após os testes
    await prisma.$disconnect();
  });

  test('Deve criar uma nova fatura e retornar os dados corretos', async () => {
    // Caminho do arquivo PDF de teste
    const pdfPath = path.join(__dirname, '../test-assets/test-invoice.pdf'); 

    const response = await request(app)
      .post('/api/invoices')
      .attach('file', pdfPath) // Simula o upload de um arquivo PDF 
      .expect(201);

    expect(response.body.customerNumber).toBe('7204076116'); // O número do cliente do PDF
    expect(response.body.referenceMonth).toBe('MAI/2024'); // Mês de referência extraído do PDF
    expect(response.body.energyConsumedQty).toBe(50); // Quantidade de energia consumida
    expect(response.body.energyCompensatedQty).toBe(449); // Quantidade de energia compensada
    expect(response.body.publicLighting).toBe(49.43); // Valor da contribuição para iluminação pública
  });

  test('Deve retornar todas as faturas existentes', async () => {
    // Faz a requisição para obter todas as faturas
    const response = await request(app)
      .get('/api/invoices')
      .expect(200);

    // Verifica se há pelo menos uma fatura criada
    expect(response.body.length).toBeGreaterThan(0);
  });
});
