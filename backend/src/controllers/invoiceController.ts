import { Request, Response } from 'express';
import { extractDataFromPDF } from '../utils/pdfExtractor';
import prisma from '../database/prismaClient';
import { calculateAggregatedValues } from '../utils/invoiceCalculations';

export const getInvoices = async (req: Request, res: Response) => {
  const invoices = await prisma.invoice.findMany();
  res.json(invoices);
};

export const addInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'File not provided' });
      return;
    }

    const fileBuffer = req.file.buffer; // O arquivo PDF em Buffer
    const data = await extractDataFromPDF(fileBuffer); // Extração de dados do PDF

    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        customerNumber_referenceMonth: {
          customerNumber: data.customerNumber,
          referenceMonth: data.referenceMonth,
        },
      },
    });

    if (existingInvoice) {
      throw new Error(`Invoice for ${data.referenceMonth} already exists for customer ${data.customerNumber}.`);
    }

    // Cálculo dos valores agregados
    const aggregatedValues = calculateAggregatedValues({
      energyConsumed: data.energyConsumed,
      energySCEE: data.energySCEE,
      energyCompensated: data.energyCompensated,
      publicLighting: data.publicLighting,
    });

    // Criação da nova fatura com os valores calculados e PDF salvo no banco de dados
    const newInvoice = await prisma.invoice.create({
      data: {
        customerNumber: data.customerNumber,
        referenceMonth: data.referenceMonth,
        totalEnergyConsumed: aggregatedValues.totalEnergyConsumed,
        totalEnergyCompensated: aggregatedValues.totalEnergyCompensated,
        totalWithoutGD: aggregatedValues.totalWithoutGD,
        gdEconomy: aggregatedValues.gdEconomy,
        energyConsumedQty: data.energyConsumed.quantity,
        energyConsumedVal: data.energyConsumed.value,
        energyCompensatedQty: data.energyCompensated.quantity,
        energyCompensatedVal: data.energyCompensated.value,
        energySCEEQty: data.energySCEE.quantity,
        energySCEEVal: data.energySCEE.value,
        publicLighting: data.publicLighting,
        pdfFile: fileBuffer,
      },
    });

    res.status(201).json(newInvoice);
  } catch (error: any) {
    console.error('Error processing invoice:', error);
    res.status(500).json({ error: error.message || 'Error processing PDF' });
  }
};

export const downloadInvoicePDF = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
    });

    if (!invoice || !invoice.pdfFile) {
      res.status(404).json({ error: 'Invoice or PDF not found' });
      return;
    }

    // Definir o cabeçalho apropriado para o download do PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
    res.send(invoice.pdfFile); // Enviar o arquivo PDF como resposta
  } catch (error) {
    res.status(500).json({ error: 'Error downloading the PDF' });
  }
};