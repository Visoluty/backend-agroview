import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Importar middlewares
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Importar rotas
import authRoutes from './routes/auth';
import imageRoutes from './routes/images';
import analysisRoutes from './routes/analyses';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares globais
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (imagens)
app.use('/uploads/images', express.static(path.join(__dirname, '../uploads/images')));

// Middleware de logging em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/analyses', analysisRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'AgroView API - Sistema de Classificação de Grãos',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      images: '/api/images',
      analyses: '/api/analyses',
      health: '/health'
    },
    documentation: 'https://github.com/your-repo/agroview-api'
  });
});

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

export default app;
