import dotenv from 'dotenv';
import app from './app';
import prismaClient from './prisma/index';
import { TokenService } from './services/tokenService';

// Carregar variáveis de ambiente PRIMEIRO
dotenv.config();

const PORT = process.env.PORT || 3000;

// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await prismaClient.$connect();
    console.log('✅ Conectado ao banco de dados PostgreSQL');

    // Limpar tokens expirados na inicialização
    await TokenService.cleanupExpiredTokens();
    console.log('✅ Tokens expirados removidos');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Função para encerrar o servidor graciosamente
const gracefulShutdown = async () => {
  console.log('\n🛑 Encerrando servidor...');
  
  try {
    await prismaClient.$disconnect();
    console.log('✅ Conexão com banco de dados encerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao encerrar servidor:', error);
    process.exit(1);
  }
};

// Capturar sinais de encerramento
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Capturar erros não tratados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();