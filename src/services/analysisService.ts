import prismaClient from '../prismaClient';
import { analyzeGrains, GrainAnalysisResult, validateGrainType } from '../utils/randomAnalysis';
import { generatePDFReport, ReportData } from '../utils/pdfGenerator';

export interface ProcessImageRequest {
  imageUrl: string;
  grainType: string;
  userId: string;
}

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

export interface AnalysisHistory {
  id: string;
  grainType: string;
  date: string;
  purityPercentage: number;
  totalGrains: number;
  defectiveGrains: number;
}

export interface ComparisonResponse {
  comparedAnalyses: Array<{
    analysisId: string;
    purityPercentage: number;
    defectiveGrains: number;
    grainType: string;
    date: string;
  }>;
  comparisonMetrics: {
    averagePurity: number;
    bestPurity: number;
    worstPurity: number;
    averageDefectiveGrains: number;
  };
}

export class AnalysisService {
  static async processImage(request: ProcessImageRequest): Promise<ProcessImageResponse> {
    // Validar tipo de grão
    if (!validateGrainType(request.grainType)) {
      throw new Error('Tipo de grão inválido');
    }

    // Realizar análise dos grãos
    const analysisResult = analyzeGrains(request.imageUrl, request.grainType);

    // Salvar análise no banco
    const analysis = await prismaClient.analysis.create({
      data: {
        userId: request.userId,
        grainType: analysisResult.grainType,
        totalGrains: analysisResult.totalGrains,
        healthyGrains: analysisResult.healthyGrains,
        defectiveGrains: analysisResult.defectiveGrains,
        defectsBreakdown: analysisResult.defectsBreakdown,
        purityPercentage: analysisResult.purityPercentage,
        impurityPercentage: analysisResult.impurityPercentage,
        imageUrl: request.imageUrl
      }
    });

    return {
      analysisId: analysis.id,
      grainType: analysis.grainType,
      totalGrains: analysis.totalGrains,
      healthyGrains: analysis.healthyGrains,
      defectiveGrains: analysis.defectiveGrains,
      defectsBreakdown: analysis.defectsBreakdown as any,
      purityPercentage: analysis.purityPercentage,
      impurityPercentage: analysis.impurityPercentage,
      imageUrl: analysis.imageUrl || ''
    };
  }

  static async getAnalysisHistory(userId: string, limit: number = 50): Promise<AnalysisHistory[]> {
    const analyses = await prismaClient.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        grainType: true,
        createdAt: true,
        purityPercentage: true,
        totalGrains: true,
        defectiveGrains: true
      }
    });

    return analyses.map((analysis: any) => ({
      id: analysis.id,
      grainType: analysis.grainType,
      date: analysis.createdAt.toISOString(),
      purityPercentage: analysis.purityPercentage,
      totalGrains: analysis.totalGrains,
      defectiveGrains: analysis.defectiveGrains
    }));
  }

  static async getAnalysisById(analysisId: string, userId: string): Promise<any> {
    const analysis = await prismaClient.analysis.findFirst({
      where: {
        id: analysisId,
        userId
      }
    });

    if (!analysis) {
      throw new Error('Análise não encontrada');
    }

    return analysis;
  }

  static async generateReport(analysisId: string, userId: string): Promise<Buffer> {
    const analysis = await this.getAnalysisById(analysisId, userId);

    const reportData: ReportData = {
      analysisId: analysis.id,
      grainType: analysis.grainType,
      date: analysis.createdAt.toISOString(),
      results: {
        grainType: analysis.grainType,
        totalGrains: analysis.totalGrains,
        healthyGrains: analysis.healthyGrains,
        defectiveGrains: analysis.defectiveGrains,
        defectsBreakdown: analysis.defectsBreakdown as any,
        purityPercentage: analysis.purityPercentage,
        impurityPercentage: analysis.impurityPercentage
      }
    };

    return await generatePDFReport(reportData);
  }

  static async compareAnalyses(analysisIds: string[], userId: string): Promise<ComparisonResponse> {
    if (analysisIds.length < 2) {
      throw new Error('É necessário pelo menos 2 análises para comparação');
    }

    const analyses = await prismaClient.analysis.findMany({
      where: {
        id: { in: analysisIds },
        userId
      },
      select: {
        id: true,
        grainType: true,
        createdAt: true,
        purityPercentage: true,
        defectiveGrains: true
      }
    });

    if (analyses.length !== analysisIds.length) {
      throw new Error('Uma ou mais análises não foram encontradas');
    }

    const comparedAnalyses = analyses.map((analysis: any) => ({
      analysisId: analysis.id,
      purityPercentage: analysis.purityPercentage,
      defectiveGrains: analysis.defectiveGrains,
      grainType: analysis.grainType,
      date: analysis.createdAt.toISOString()
    }));

    const purityValues = analyses.map((a: any) => a.purityPercentage);
    const defectiveValues = analyses.map((a: any) => a.defectiveGrains);

    const comparisonMetrics = {
      averagePurity: Number((purityValues.reduce((sum: any, val: any) => sum + val, 0) / purityValues.length).toFixed(2)),
      bestPurity: Math.max(...purityValues),
      worstPurity: Math.min(...purityValues),
      averageDefectiveGrains: Number((defectiveValues.reduce((sum: any, val: any) => sum + val, 0) / defectiveValues.length).toFixed(0))
    };

    return {
      comparedAnalyses,
      comparisonMetrics
    };
  }

  static async getAnalysisStats(userId: string): Promise<any> {
    const stats = await prismaClient.analysis.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { purityPercentage: true },
      _min: { purityPercentage: true },
      _max: { purityPercentage: true }
    });

    const grainTypeStats = await prismaClient.analysis.groupBy({
      by: ['grainType'],
      where: { userId },
      _count: { id: true },
      _avg: { purityPercentage: true }
    });

    return {
      totalAnalyses: stats._count.id,
      averagePurity: Number((stats._avg.purityPercentage || 0).toFixed(2)),
      bestPurity: stats._max.purityPercentage,
      worstPurity: stats._min.purityPercentage,
      grainTypeBreakdown: grainTypeStats.map((stat: any) => ({
        grainType: stat.grainType,
        count: stat._count.id,
        averagePurity: Number((stat._avg.purityPercentage || 0).toFixed(2))
      }))
    };
  }

  static async deleteAnalysis(analysisId: string, userId: string): Promise<void> {
    const analysis = await prismaClient.analysis.findFirst({
      where: {
        id: analysisId,
        userId
      }
    });

    if (!analysis) {
      throw new Error('Análise não encontrada');
    }

    await prismaClient.analysis.delete({
      where: { id: analysisId }
    });
  }
}
