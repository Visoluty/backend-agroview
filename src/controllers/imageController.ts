import { Request, Response } from 'express';
import { AnalysisService, ProcessImageRequest } from '../services/analysisService';
import { generateFileUrl } from '../middlewares/upload';
import { asyncHandler, createValidationError, createUnauthorizedError } from '../middlewares/errorHandler';

export interface ProcessImageResponse {
  analysisId: string;
  grainType: string;
  totalGrains: number;
  healthyGrains: number;
  defectiveGrains: number;
  defectsBreakdown: {
    broken: number;
    damaged: number;
    discolored: number;
    foreignMatter: number;
  };
  purityPercentage: number;
  impurityPercentage: number;
  imageUrl: string;
}

export class ImageController {
  static processImage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { grainType } = req.body;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!req.file) {
      throw createValidationError('Nenhuma imagem foi enviada');
    }

    if (!grainType) {
      throw createValidationError('Tipo de grão é obrigatório');
    }

    // Gerar URL da imagem
    const imageUrl = generateFileUrl(req.file.filename);

    // Preparar dados para análise
    const processRequest: ProcessImageRequest = {
      imageUrl,
      grainType,
      userId
    };

    // Processar imagem
    const result: ProcessImageResponse = await AnalysisService.processImage(processRequest);

    res.status(201).json({
      message: 'Imagem processada com sucesso',
      data: result
    });
  });

  static getImageInfo = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    if (!filename) {
      throw createValidationError('Nome do arquivo é obrigatório');
    }

    // Aqui futuramente podemos implementar lógica para obter informações da imagem como metadados, tamanho, etc. - Luís Gustavo.
    
    const imageUrl = generateFileUrl(filename);

    res.json({
      message: 'Informações da imagem obtidas com sucesso',
      data: {
        filename,
        url: imageUrl
      }
    });
  });

  static validateImage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!req.file) {
      throw createValidationError('Nenhuma imagem foi enviada');
    }

    // futuramente podemos implementar lógica para validar a imagem como resolução mínima, formato específico, etc. - Luís Gustavo.

    const imageInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: generateFileUrl(req.file.filename)
    };

    res.json({
      message: 'Imagem validada com sucesso',
      data: imageInfo
    });
  });

  static deleteImage = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!filename) {
      throw createValidationError('Nome do arquivo é obrigatório');
    }

    // Futuramente podemos implementar lógica para deletar a imagem do sistema de arquivos
    // e também remover referências no banco de dados se necessário - Luís Gustavo.

    res.json({
      message: 'Imagem deletada com sucesso'
    });
  });

  static getSupportedFormats = asyncHandler(async (req: Request, res: Response) => {
    const supportedFormats = {
      imageTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      extensions: ['.jpg', '.jpeg', '.png'],
      maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
      maxSizeFormatted: '5MB'
    };

    res.json({
      message: 'Formatos suportados obtidos com sucesso',
      data: supportedFormats
    });
  });
}
