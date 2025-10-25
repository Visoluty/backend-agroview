# 🚀 Instruções de Configuração - AgroView API

## ⚙️ Configuração Inicial

### 1. Criar arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agroview_db"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-change-in-production"

# Server Configuration
PORT=3055
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# Frontend URL (para CORS)
FRONTEND_URL="http://localhost:3055"

# External API (se necessário)
EXTERNAL_API_URL=""
EXTERNAL_API_KEY=""
```

### 2. Configurar Banco PostgreSQL

```bash
# Instalar PostgreSQL (se não tiver)
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Criar banco de dados
createdb agroview_db

# Ou usando psql:
psql -U postgres
CREATE DATABASE agroview_db;
\q
```

### 3. Executar Migrações

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma db push

# (Opcional) Visualizar banco de dados
npx prisma studio
```

### 4. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🔧 Correções Aplicadas

### ✅ **Problemas Corrigidos:**

1. **Duplicação do `dotenv.config()`**
   - Removido do `app.ts`
   - Mantido apenas no `server.ts` (onde deve estar)

2. **Melhorias no Console do Servidor**
   - Adicionado link para Health Check
   - Adicionado link para Swagger Docs
   - Comentários mais claros

3. **Limpeza de Código**
   - Removida linha vazia desnecessária
   - Organização melhor dos imports

### 📁 **Estrutura Final:**

```
src/
├── app.ts              # Configuração Express (sem dotenv)
├── server.ts           # Inicialização servidor (com dotenv)
├── config/
│   └── swagger.ts      # Configuração Swagger
├── routes/             # Rotas documentadas
├── controllers/        # Controllers
├── services/           # Lógica de negócio
├── middlewares/        # Middlewares
└── utils/              # Utilitários
```

## 🌐 **URLs Importantes:**

- **API Base**: `http://localhost:3055`
- **Health Check**: `http://localhost:3055/health`
- **Swagger Docs**: `http://localhost:3055/api-docs`
- **Uploads**: `http://localhost:3055/uploads/images/`

## 🧪 **Testando a API:**

### 1. Health Check
```bash
curl http://localhost:3055/health
```

### 2. Swagger UI
Acesse: `http://localhost:3055/api-docs`

### 3. Cadastro de Usuário
```bash
curl -X POST http://localhost:3055/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123",
    "userType": "PRODUTOR"
  }'
```

## 🚨 **Troubleshooting:**

### Erro: "Missing required environment variable: DATABASE_URL"
- Verifique se o arquivo `.env` existe na raiz
- Verifique se a `DATABASE_URL` está correta

### Erro: "Connection refused"
- Verifique se o PostgreSQL está rodando
- Verifique se o banco `agroview_db` existe

### Erro: "Token inválido"
- Verifique se as variáveis `JWT_SECRET` e `JWT_REFRESH_SECRET` estão definidas

## 📚 **Próximos Passos:**

1. ✅ Configurar arquivo `.env`
2. ✅ Configurar banco PostgreSQL
3. ✅ Executar migrações
4. ✅ Iniciar servidor
5. ✅ Testar endpoints no Swagger
6. ✅ Implementar frontend (opcional)

---

**Agora o backend está pronto para uso!** 🎉
