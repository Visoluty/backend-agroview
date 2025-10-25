import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AgroView API',
    version: '1.0.0',
    description: 'Sistema de classificação de grãos com análise de imagens e geração de relatórios',
    contact: {
      name: 'AgroView Team',
      email: 'contato@agroview.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: 'http://localhost:3055',
      description: 'Servidor de Desenvolvimento'
    },
    {
      url: 'https://api.agroview.com',
      description: 'Servidor de Produção'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT para autenticação'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único do usuário'
          },
          name: {
            type: 'string',
            description: 'Nome completo do usuário'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário'
          },
          userType: {
            type: 'string',
            enum: ['PRODUTOR', 'COOPERATIVA', 'COMPRADOR'],
            description: 'Tipo de usuário'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de atualização'
          }
        }
      },
      UserRegister: {
        type: 'object',
        required: ['name', 'email', 'password', 'userType'],
        properties: {
          name: {
            type: 'string',
            description: 'Nome completo do usuário',
            example: 'João Silva'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário',
            example: 'joao@exemplo.com'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Senha do usuário (mínimo 6 caracteres)',
            example: 'senha123'
          },
          userType: {
            type: 'string',
            enum: ['PRODUTOR', 'COOPERATIVA', 'COMPRADOR'],
            description: 'Tipo de usuário',
            example: 'PRODUTOR'
          }
        }
      },
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário',
            example: 'joao@exemplo.com'
          },
          password: {
            type: 'string',
            description: 'Senha do usuário',
            example: 'senha123'
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'Token de acesso JWT'
          },
          refreshToken: {
            type: 'string',
            description: 'Token de renovação JWT'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      Analysis: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único da análise'
          },
          userId: {
            type: 'string',
            description: 'ID do usuário que realizou a análise'
          },
          grainType: {
            type: 'string',
            description: 'Tipo de grão analisado',
            example: 'Soja'
          },
          totalGrains: {
            type: 'integer',
            description: 'Total de grãos analisados',
            example: 450
          },
          healthyGrains: {
            type: 'integer',
            description: 'Número de grãos saudáveis',
            example: 405
          },
          defectiveGrains: {
            type: 'integer',
            description: 'Número de grãos defeituosos',
            example: 45
          },
          defectsBreakdown: {
            type: 'object',
            properties: {
              broken: {
                type: 'integer',
                description: 'Grãos quebrados',
                example: 15
              },
              damaged: {
                type: 'integer',
                description: 'Grãos danificados',
                example: 12
              },
              discolored: {
                type: 'integer',
                description: 'Grãos descoloridos',
                example: 10
              },
              foreignMatter: {
                type: 'integer',
                description: 'Matéria estranha',
                example: 8
              }
            }
          },
          purityPercentage: {
            type: 'number',
            format: 'float',
            description: 'Percentual de pureza',
            example: 90.0
          },
          impurityPercentage: {
            type: 'number',
            format: 'float',
            description: 'Percentual de impureza',
            example: 10.0
          },
          imageUrl: {
            type: 'string',
            description: 'URL da imagem analisada',
            example: '/uploads/images/grain-analysis-123456789.jpg'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da análise'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de atualização'
          }
        }
      },
      ProcessImageResponse: {
        type: 'object',
        properties: {
          analysisId: {
            type: 'string',
            description: 'ID da análise criada'
          },
          grainType: {
            type: 'string',
            description: 'Tipo de grão analisado'
          },
          totalGrains: {
            type: 'integer',
            description: 'Total de grãos analisados'
          },
          healthyGrains: {
            type: 'integer',
            description: 'Número de grãos saudáveis'
          },
          defectiveGrains: {
            type: 'integer',
            description: 'Número de grãos defeituosos'
          },
          defectsBreakdown: {
            type: 'object',
            properties: {
              broken: { type: 'integer' },
              damaged: { type: 'integer' },
              discolored: { type: 'integer' },
              foreignMatter: { type: 'integer' }
            }
          },
          purityPercentage: {
            type: 'number',
            format: 'float',
            description: 'Percentual de pureza'
          },
          impurityPercentage: {
            type: 'number',
            format: 'float',
            description: 'Percentual de impureza'
          },
          imageUrl: {
            type: 'string',
            description: 'URL da imagem analisada'
          }
        }
      },
      AnalysisHistory: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID da análise'
          },
          grainType: {
            type: 'string',
            description: 'Tipo de grão'
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'Data da análise'
          },
          purityPercentage: {
            type: 'number',
            format: 'float',
            description: 'Percentual de pureza'
          },
          totalGrains: {
            type: 'integer',
            description: 'Total de grãos'
          },
          defectiveGrains: {
            type: 'integer',
            description: 'Grãos defeituosos'
          }
        }
      },
      ComparisonResponse: {
        type: 'object',
        properties: {
          comparedAnalyses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                analysisId: { type: 'string' },
                purityPercentage: { type: 'number' },
                defectiveGrains: { type: 'integer' },
                grainType: { type: 'string' },
                date: { type: 'string', format: 'date-time' }
              }
            }
          },
          comparisonMetrics: {
            type: 'object',
            properties: {
              averagePurity: { type: 'number' },
              bestPurity: { type: 'number' },
              worstPurity: { type: 'number' },
              averageDefectiveGrains: { type: 'number' }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Mensagem de erro'
          },
          code: {
            type: 'string',
            description: 'Código do erro'
          },
          details: {
            type: 'object',
            description: 'Detalhes adicionais do erro'
          }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Mensagem de sucesso'
          },
          data: {
            type: 'object',
            description: 'Dados da resposta'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
