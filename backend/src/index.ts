import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import invoiceRoutes from './routes/invoiceRoutes';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middleware para habilitar CORS e JSON parsing
app.use(cors());
app.use(express.json());

// Rota simples para verificar o status do servidor
app.get('/', (req, res) => {
  res.send('Servidor Express está funcionando!');
});

// Usar o roteador das faturas
app.use('/api', invoiceRoutes);

// Exporta o app para que possa ser utilizado nos testes
export default app;

// Iniciar o servidor (para execução normal fora dos testes)
if (process.env.NODE_ENV !== 'test') {
  app.listen({
    host: '0.0.0.0',
    port
  }).on('listening', () => {
    console.log(`Servidor Express iniciado na porta ${port}`);
  });
}
