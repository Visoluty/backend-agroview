# Exemplos de Uso da API AgroView

Este arquivo contém exemplos práticos de como usar a API do AgroView.

## 🔐 1. Autenticação

### Cadastro de Usuário

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

### Login

```bash
curl -X POST http://localhost:3055/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "userType": "PRODUTOR"
    }
  }
}
```

## 📸 2. Upload e Processamento de Imagem

### Processar Imagem de Grãos

```bash
curl -X POST http://localhost:3055/api/images/process \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "image=@caminho/para/imagem.jpg" \
  -F "grainType=Soja"
```

**Resposta:**
```json
{
  "message": "Imagem processada com sucesso",
  "data": {
    "analysisId": "analysis_456",
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

## 📊 3. Consultar Análises

### Histórico de Análises

```bash
curl -X GET "http://localhost:3055/api/analyses?limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Análise Específica

```bash
curl -X GET http://localhost:3055/api/analyses/analysis_456 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Estatísticas

```bash
curl -X GET http://localhost:3055/api/analyses/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Resposta:**
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
      },
      {
        "grainType": "Milho",
        "count": 10,
        "averagePurity": 85.1
      }
    ]
  }
}
```

## 📄 4. Relatórios PDF

### Download do Relatório

```bash
curl -X GET http://localhost:3055/api/analyses/analysis_456/report \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -o relatorio.pdf
```

### Visualizar Relatório no Navegador

```bash
# Acesse diretamente no navegador:
http://localhost:3055/api/analyses/analysis_456/export
```

## 🔄 5. Comparar Análises

```bash
curl -X POST http://localhost:3055/api/analyses/compare \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "analysisIds": ["analysis_456", "analysis_789", "analysis_101"]
  }'
```

**Resposta:**
```json
{
  "message": "Comparação de análises realizada com sucesso",
  "data": {
    "comparedAnalyses": [
      {
        "analysisId": "analysis_456",
        "purityPercentage": 90.0,
        "defectiveGrains": 45,
        "grainType": "Soja",
        "date": "2024-01-15T10:30:00Z"
      },
      {
        "analysisId": "analysis_789",
        "purityPercentage": 85.5,
        "defectiveGrains": 72,
        "grainType": "Milho",
        "date": "2024-01-14T14:20:00Z"
      }
    ],
    "comparisonMetrics": {
      "averagePurity": 87.75,
      "bestPurity": 90.0,
      "worstPurity": 85.5,
      "averageDefectiveGrains": 58
    }
  }
}
```

## 🔄 6. Renovar Token

```bash
curl -X POST http://localhost:3055/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 👤 7. Gerenciar Perfil

### Obter Perfil

```bash
curl -X GET http://localhost:3055/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Atualizar Perfil

```bash
curl -X PUT http://localhost:3055/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Santos",
    "email": "joao.novo@exemplo.com"
  }'
```

## 🚪 8. Logout

### Logout Simples

```bash
curl -X POST http://localhost:3055/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Logout de Todos os Dispositivos

```bash
curl -X POST http://localhost:3055/api/auth/logout-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📋 9. Informações da API

### Health Check

```bash
curl -X GET http://localhost:3055/health
```

### Informações da API

```bash
curl -X GET http://localhost:3055/
```

## 🛠️ 10. Scripts Úteis

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3055/api';

// Função para fazer login
async function login(email, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password
    });
    return response.data.data;
  } catch (error) {
    console.error('Erro no login:', error.response.data);
    throw error;
  }
}

// Função para processar imagem
async function processImage(token, imagePath, grainType) {
  try {
    const FormData = require('form-data');
    const fs = require('fs');
    
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    form.append('grainType', grainType);
    
    const response = await axios.post(`${API_BASE}/images/process`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Erro no processamento:', error.response.data);
    throw error;
  }
}

// Exemplo de uso
async function exemplo() {
  try {
    // Login
    const auth = await login('joao@exemplo.com', 'senha123');
    console.log('Login realizado:', auth.user.name);
    
    // Processar imagem
    const analysis = await processImage(auth.token, './imagem.jpg', 'Soja');
    console.log('Análise concluída:', analysis.purityPercentage + '% de pureza');
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}
```

### Python

```python
import requests
import json

API_BASE = 'http://localhost:3055/api'

def login(email, password):
    response = requests.post(f'{API_BASE}/auth/login', json={
        'email': email,
        'password': password
    })
    return response.json()['data']

def process_image(token, image_path, grain_type):
    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'grainType': grain_type}
        headers = {'Authorization': f'Bearer {token}'}
        
        response = requests.post(
            f'{API_BASE}/images/process',
            files=files,
            data=data,
            headers=headers
        )
    return response.json()['data']

# Exemplo de uso
try:
    # Login
    auth = login('joao@exemplo.com', 'senha123')
    print(f'Login realizado: {auth["user"]["name"]}')
    
    # Processar imagem
    analysis = process_image(auth['token'], './imagem.jpg', 'Soja')
    print(f'Análise concluída: {analysis["purityPercentage"]}% de pureza')
    
except Exception as e:
    print(f'Erro: {e}')
```

## 🔍 11. Códigos de Erro Comuns

| Código | Descrição | Solução |
|--------|-----------|---------|
| `MISSING_TOKEN` | Token não fornecido | Adicionar header Authorization |
| `INVALID_TOKEN` | Token inválido/expirado | Fazer login novamente |
| `VALIDATION_ERROR` | Dados inválidos | Verificar formato dos dados |
| `FILE_TOO_LARGE` | Arquivo muito grande | Reduzir tamanho da imagem |
| `NO_FILE_UPLOADED` | Nenhum arquivo enviado | Verificar campo 'image' |
| `NOT_FOUND` | Recurso não encontrado | Verificar ID da análise |

## 📝 12. Dicas Importantes

1. **Tokens**: Access tokens expiram em 15 minutos, use refresh tokens para renovar
2. **Imagens**: Formatos aceitos: JPEG, PNG, JPG (máximo 5MB)
3. **Rate Limiting**: Evite muitas requisições simultâneas
4. **CORS**: Configure corretamente para desenvolvimento/produção
5. **Logs**: Em desenvolvimento, todos os requests são logados
6. **Backup**: Faça backup regular do banco de dados PostgreSQL

---

**AgroView API v1.0.0** - Exemplos de Uso
