import { Router } from 'express';
import multer from 'multer';
import { getInvoices, addInvoice, downloadInvoicePDF } from '../controllers/invoiceController';

const upload = multer(); // Inicializa o multer

const router = Router();

router.get('/invoices', getInvoices);
router.post('/invoices', upload.single('file'), addInvoice); // O arquivo é processado pelo multer
router.get('/invoices/:id/download', downloadInvoicePDF); 

export default router;
