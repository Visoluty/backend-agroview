# Swagger Documentation - AgroView API

## 📖 Documentação Interativa

A API AgroView possui documentação completa e interativa através do Swagger UI.

### 🌐 Acesso à Documentação

**URL**: `http://localhost:3000/api-docs`

### ✨ Funcionalidades do Swagger

1. **Documentação Completa**: Todos os endpoints documentados com exemplos
2. **Teste Interativo**: Execute requisições diretamente no navegador
3. **Esquemas de Dados**: Modelos detalhados de request/response
4. **Autenticação**: Sistema de autenticação JWT integrado
5. **Códigos de Resposta**: Documentação completa de todos os códigos HTTP

### 🔐 Como Usar a Autenticação no Swagger

1. **Acesse**: `http://localhost:3000/api-docs`
2. **Clique em "Authorize"** (botão verde no topo)
3. **Cole seu token JWT** no formato: `Bearer SEU_TOKEN_AQUI`
4. **Clique em "Authorize"** para confirmar
5. **Agora você pode testar** todas as rotas protegidas

### 📋 Exemplo de Fluxo Completo

#### 1. Cadastro de Usuário
```bash
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "userType": "PRODUTOR"
}
```

#### 2. Login
```bash
POST /api/auth/login
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

#### 3. Usar Token no Swagger
- Copie o `token` da resposta do login
- No Swagger, clique em "Authorize"
- Cole: `Bearer SEU_TOKEN_AQUI`
- Clique em "Authorize"

#### 4. Processar Imagem
```bash
POST /api/images/process
# Upload de arquivo + grainType: "Soja"
```

#### 5. Consultar Análises
```bash
GET /api/analyses
```

#### 6. Gerar Relatório PDF
```bash
GET /api/analyses/{id}/report
```

### 🎯 Principais Seções da Documentação

#### **Autenticação**
- `/api/auth/register` - Cadastro
- `/api/auth/login` - Login
- `/api/auth/refresh-token` - Renovar token
- `/api/auth/logout` - Logout
- `/api/auth/profile` - Perfil do usuário

#### **Imagens**
- `/api/images/process` - Upload e análise
- `/api/images/validate` - Validar imagem
- `/api/images/formats` - Formatos suportados
- `/api/images/info/{filename}` - Informações da imagem

#### **Análises**
- `/api/analyses` - Histórico
- `/api/analyses/recent` - Análises recentes
- `/api/analyses/stats` - Estatísticas
- `/api/analyses/{id}` - Análise específica
- `/api/analyses/{id}/report` - Download PDF
- `/api/analyses/compare` - Comparar análises

### 🔧 Recursos Avançados

#### **Upload de Arquivos**
- No Swagger, use o botão "Choose File" para uploads
- Formatos aceitos: JPEG, PNG, JPG
- Tamanho máximo: 5MB

#### **Parâmetros de Query**
- `limit` - Limite de resultados (padrão: 50)
- `grainType` - Filtrar por tipo de grão

#### **Códigos de Resposta**
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `409` - Conflito (email já existe)

### 📊 Exemplos de Respostas

#### **Análise de Grãos**
```json
{
  "message": "Imagem processada com sucesso",
  "data": {
    "analysisId": "analysis_123",
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

#### **Estatísticas**
```json
{
  "message": "Estatísticas obtidas com sucesso",
  "data": {
    "totalAnalyses": 25,
    "averagePurity": 87.5,
    "bestPurity": 95.2,
    "worstPurity": 78.1,
    "grainTypeBreakdown": [
      {
        "grainType": "Soja",
        "count": 15,
        "averagePurity": 89.2
      }
    ]
  }
}
```

### 🚀 Dicas de Uso

1. **Sempre teste primeiro** as rotas públicas (`/register`, `/login`)
2. **Use o botão "Authorize"** para autenticar antes de testar rotas protegidas
3. **Copie o token completo** incluindo "Bearer " no início
4. **Para uploads**, use o botão "Choose File" no Swagger
5. **Verifique os códigos de resposta** para entender erros
6. **Use os exemplos** fornecidos em cada endpoint

### 🔍 Troubleshooting

#### **Erro 401 - Unauthorized**
- Verifique se o token está correto
- Certifique-se de incluir "Bearer " antes do token
- Verifique se o token não expirou (15 minutos)

#### **Erro 400 - Bad Request**
- Verifique se todos os campos obrigatórios estão preenchidos
- Para uploads, verifique o formato e tamanho do arquivo
- Verifique se o tipo de grão é válido

#### **Erro 404 - Not Found**
- Verifique se o ID da análise existe
- Certifique-se de que a análise pertence ao usuário logado

### 📱 Integração com Frontend

O Swagger também serve como referência para integração com frontend:

```javascript
// Exemplo de integração JavaScript
const API_BASE = 'http://localhost:3000/api';

// Login
const loginResponse = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});

const { token } = await loginResponse.json();

// Usar token em requisições protegidas
const analysesResponse = await fetch(`${API_BASE}/analyses`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

**Acesse agora**: `http://localhost:3000/api-docs` para explorar a documentação completa!
