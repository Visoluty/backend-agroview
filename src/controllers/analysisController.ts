import { Request, Response } from 'express';
import { AnalysisService, ComparisonResponse } from '../services/analysisService';
import { asyncHandler, createValidationError, createUnauthorizedError, createNotFoundError } from '../middlewares/errorHandler';

export class AnalysisController {
  static getAnalysisHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (limit > 100) {
      throw createValidationError('Limite máximo de 100 análises por requisição');
    }

    const analyses = await AnalysisService.getAnalysisHistory(userId, limit);

    res.json({
      message: 'Histórico de análises obtido com sucesso',
      data: analyses,
      pagination: {
        limit,
        total: analyses.length
      }
    });
  });

  static getAnalysisById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!id) {
      throw createValidationError('ID da análise é obrigatório');
    }

    const analysis = await AnalysisService.getAnalysisById(id, userId);

    res.json({
      message: 'Análise obtida com sucesso',
      data: analysis
    });
  });

  static generateReport = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!id) {
      throw createValidationError('ID da análise é obrigatório');
    }

    const pdfBuffer = await AnalysisService.generateReport(id, userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-analise-${id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length.toString());

    res.send(pdfBuffer);
  });

  static exportReport = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!id) {
      throw createValidationError('ID da análise é obrigatório');
    }

    const pdfBuffer = await AnalysisService.generateReport(id, userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="relatorio-analise-${id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length.toString());

    res.send(pdfBuffer);
  });

  static compareAnalyses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { analysisIds } = req.body;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!analysisIds || !Array.isArray(analysisIds)) {
      throw createValidationError('Lista de IDs de análises é obrigatória');
    }

    if (analysisIds.length < 2) {
      throw createValidationError('É necessário pelo menos 2 análises para comparação');
    }

    if (analysisIds.length > 10) {
      throw createValidationError('Máximo de 10 análises por comparação');
    }

    const comparison: ComparisonResponse = await AnalysisService.compareAnalyses(analysisIds, userId);

    res.json({
      message: 'Comparação de análises realizada com sucesso',
      data: comparison
    });
  });

  static getAnalysisStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    const stats = await AnalysisService.getAnalysisStats(userId);

    res.json({
      message: 'Estatísticas obtidas com sucesso',
      data: stats
    });
  });

  static getAnalysisByGrainType = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { grainType } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!grainType) {
      throw createValidationError('Tipo de grão é obrigatório');
    }

    if (limit > 50) {
      throw createValidationError('Limite máximo de 50 análises por requisição');
    }

    // Buscar análises por tipo de grão
    const analyses = await AnalysisService.getAnalysisHistory(userId, limit);
    const filteredAnalyses = analyses.filter(analysis => 
      analysis.grainType.toLowerCase() === grainType.toLowerCase()
    );

    res.json({
      message: `Análises de ${grainType} obtidas com sucesso`,
      data: filteredAnalyses,
      pagination: {
        limit,
        total: filteredAnalyses.length,
        grainType
      }
    });
  });

  static getRecentAnalyses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (limit > 20) {
      throw createValidationError('Limite máximo de 20 análises recentes');
    }

    const analyses = await AnalysisService.getAnalysisHistory(userId, limit);

    res.json({
      message: 'Análises recentes obtidas com sucesso',
      data: analyses,
      pagination: {
        limit,
        total: analyses.length
      }
    });
  });

  static deleteAnalysis = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    if (!id) {
      throw createValidationError('ID da análise é obrigatório');
    }

    // Verificar se a análise existe e pertence ao usuário
    const analysis = await AnalysisService.getAnalysisById(id, userId);

    await AnalysisService.deleteAnalysis(id, userId);

    res.json({
      message: 'Análise deletada com sucesso'
    });
  });
}
