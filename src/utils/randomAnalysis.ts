export interface GrainAnalysisResult {
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
}

export const analyzeGrains = (imageUrl: string, grainType: string): GrainAnalysisResult => {
  // Simulação de análise de grãos com dados aleatórios realistas
  const totalGrains = Math.floor(Math.random() * 500) + 200; // 200-700 grãos
  
  // Percentual de grãos saudáveis (85-95%)
  const healthyPercentage = Math.random() * 0.1 + 0.85;
  const healthyGrains = Math.floor(totalGrains * healthyPercentage);
  const defectiveGrains = totalGrains - healthyGrains;
  
  // Distribuição dos defeitos
  const defectsBreakdown = {
    broken: Math.floor(defectiveGrains * (Math.random() * 0.3 + 0.2)), // 20-50%
    damaged: Math.floor(defectiveGrains * (Math.random() * 0.3 + 0.2)), // 20-50%
    discolored: Math.floor(defectiveGrains * (Math.random() * 0.2 + 0.1)), // 10-30%
    foreignMatter: Math.floor(defectiveGrains * (Math.random() * 0.2 + 0.1)) // 10-30%
  };
  
  // Ajustar para garantir que a soma seja igual ao total de grãos defeituosos
  const totalDefects = Object.values(defectsBreakdown).reduce((sum, count) => sum + count, 0);
  if (totalDefects !== defectiveGrains) {
    defectsBreakdown.broken += defectiveGrains - totalDefects;
  }
  
  const purityPercentage = Number((healthyGrains / totalGrains * 100).toFixed(2));
  const impurityPercentage = Number((defectiveGrains / totalGrains * 100).toFixed(2));
  
  return {
    grainType,
    totalGrains,
    healthyGrains,
    defectiveGrains,
    defectsBreakdown,
    purityPercentage,
    impurityPercentage
  };
};

export const getGrainTypes = (): string[] => {
  return [
    'Soja',
    'Milho',
    'Trigo',
    'Arroz',
    'Feijão',
    'Café',
    'Aveia',
    'Cevada',
    'Sorgo',
    'Girassol'
  ];
};

export const validateGrainType = (grainType: string): boolean => {
  const validTypes = getGrainTypes();
  return validTypes.includes(grainType);
};
