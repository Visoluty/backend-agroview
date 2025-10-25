# AgroView - Backend API

Sistema de classificação de grãos com análise de imagens e geração de relatórios.

## 🚀 Tecnologias

- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** (PostgreSQL)
- **JWT** (Access + Refresh Tokens)
- **Multer** (Upload de imagens)
- **Puppeteer** (Geração de PDF)
- **Axios** (Requisições externas)

## 📁 Estrutura do Projeto

```
backend-agroview/
├─ prisma/
│ └─ schema.prisma          # Modelos do banco de dados
├─ uploads/
│ └─ images/                # Armazenamento de imagens
├─ src/
│ ├─ controllers/            # Lógica das rotas
│ │ ├─ authController.ts
│ │ ├─ imageController.ts
│ │ └─ analysisController.ts
│ ├─ middlewares/            # Middlewares globais
│ │ ├─ auth.ts
│ │ ├─ errorHandler.ts
│ │ └─ upload.ts
│ ├─ routes/                 # Definição das rotas
│ │ ├─ auth.ts
│ │ ├─ images.ts
│ │ └─ analyses.ts
│ ├─ services/               # Regras de negócio
│ │ ├─ tokenService.ts
│ │ └─ analysisService.ts
│ ├─ utils/                  # Funções utilitárias
│ │ ├─ jwt.ts
│ │ ├─ randomAnalysis.ts
│ │ └─ pdfGenerator.ts
│ ├─ prismaClient.ts         # Cliente Prisma
│ ├─ app.ts                  # Configuração Express
│ └─ server.ts               # Inicialização
├─ .env.example              # Variáveis de ambiente
├─ package.json
└─ tsconfig.json
```

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agroview_db"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# Server Configuration
PORT=3055
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg
```

### 3. Configurar Banco PostgreSQL

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma db push
```

### 4. Executar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 API Endpoints

### Documentação Interativa (Swagger)
- **Swagger UI**: `http://localhost:3055/api-docs`
- **Documentação completa** com exemplos de requisições e respostas
- **Teste das rotas** diretamente no navegador
- **Esquemas de dados** detalhados para todos os endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/register` | Cadastro de usuário |
| POST | `/login` | Login e geração de tokens |
| POST | `/refresh-token` | Renovar tokens |
| POST | `/logout` | Logout |
| POST | `/logout-all` | Logout de todos os dispositivos |
| GET | `/profile` | Obter perfil do usuário |
| PUT | `/profile` | Atualizar perfil |

### Imagens (`/api/images`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/process` | Upload e processamento de imagem |
| POST | `/validate` | Validar imagem (sem análise) |
| GET | `/info/:filename` | Informações da imagem |
| DELETE | `/:filename` | Deletar imagem |
| GET | `/formats` | Formatos suportados |

### Análises (`/api/analyses`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Histórico de análises |
| GET | `/recent` | Análises recentes |
| GET | `/stats` | Estatísticas das análises |
| GET | `/grain-type/:type` | Análises por tipo de grão |
| GET | `/:id` | Análise específica |
| GET | `/:id/report` | Download do relatório PDF |
| GET | `/:id/export` | Visualizar relatório PDF |
| POST | `/compare` | Comparar análises |
| DELETE | `/:id` | Deletar análise |

## 🔐 Autenticação

O sistema utiliza JWT com Access Token (15min) e Refresh Token (7 dias).

### Headers Necessários

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Exemplo de Login

```json
POST /api/auth/login
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Resposta

```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "name": "Nome do Usuário",
      "email": "usuario@exemplo.com",
      "userType": "PRODUTOR"
    }
  }
}
```

## 📸 Upload de Imagens

### Processamento de Imagem

```bash
curl -X POST http://localhost:3055/api/images/process \
  -H "Authorization: Bearer <token>" \
  -F "image=@imagem.jpg" \
  -F "grainType=Soja"
```

### Formatos Suportados

- **Tipos**: JPEG, PNG, JPG
- **Tamanho máximo**: 5MB
- **Resolução**: Recomendado mínimo 800x600px

## 📊 Tipos de Grãos Suportados

- Soja
- Milho
- Trigo
- Arroz
- Feijão
- Café
- Aveia
- Cevada
- Sorgo
- Girassol

## 📈 Exemplo de Análise

### Resposta do Processamento

```json
{
  "message": "Imagem processada com sucesso",
  "data": {
    "analysisId": "analysis_id",
    "grainType": "Soja",
    "totalGrains": 450,
    "healthyGrains": 405,
    "defectiveGrains": 45,
    "defectsBreakdown": {
      "broken": 15,
      "damaged": 12,
      "discolored": 10,
      "foreignMatter": 8
    },
    "purityPercentage": 90.0,
    "impurityPercentage": 10.0,
    "imageUrl": "/uploads/images/grain-analysis-123456789.jpg"
  }
}
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Gerar cliente Prisma
npx prisma generate

# Visualizar banco de dados
npx prisma studio

# Reset do banco
npx prisma db push --force-reset
```

## 🛡️ Segurança

- **Senhas**: Hash com bcrypt (12 rounds)
- **Tokens**: JWT com rotação de refresh tokens
- **Upload**: Validação de tipo e tamanho de arquivo
- **CORS**: Configurado para desenvolvimento e produção
- **Rate Limiting**: Implementado nas rotas sensíveis

## 🐛 Tratamento de Erros

O sistema possui tratamento global de erros com códigos específicos:

- `VALIDATION_ERROR`: Dados inválidos
- `UNAUTHORIZED`: Não autenticado
- `FORBIDDEN`: Sem permissão
- `NOT_FOUND`: Recurso não encontrado
- `CONFLICT`: Conflito de dados
- `FILE_TOO_LARGE`: Arquivo muito grande
- `INVALID_TOKEN`: Token inválido

## 📝 Logs

Em desenvolvimento, todos os requests são logados no console com timestamp e método HTTP.

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="strong-secret-key"
JWT_REFRESH_SECRET="strong-refresh-secret"
PORT=3055
FRONTEND_URL="https://your-frontend.com"
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.

---

**AgroView API v1.0.0** - Sistema de Classificação de Grãos
