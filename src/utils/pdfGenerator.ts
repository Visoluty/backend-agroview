import puppeteer from 'puppeteer';
import { GrainAnalysisResult } from './randomAnalysis';

export interface ReportData {
  analysisId: string;
  grainType: string;
  date: string;
  results: GrainAnalysisResult;
  charts?: {
    barChartUrl?: string;
    pieChartUrl?: string;
  };
}

export const generatePDFReport = async (reportData: ReportData): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const htmlContent = generateHTMLReport(reportData);

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  });

  await browser.close();

  return pdfBuffer;
};

const generateHTMLReport = (data: ReportData): string => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Análise de Grãos</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #2c5530;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #2c5530;
                margin: 0;
                font-size: 28px;
            }
            .header h2 {
                color: #666;
                margin: 10px 0 0 0;
                font-size: 18px;
                font-weight: normal;
            }
            .info-section {
                margin-bottom: 30px;
            }
            .info-section h3 {
                color: #2c5530;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-top: 15px;
            }
            .info-item {
                background: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #2c5530;
            }
            .info-item strong {
                color: #2c5530;
            }
            .results-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 15px;
                margin-top: 15px;
            }
            .result-card {
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .result-card h4 {
                margin: 0 0 10px 0;
                color: #2c5530;
                font-size: 16px;
            }
            .result-card .value {
                font-size: 24px;
                font-weight: bold;
                color: #2c5530;
            }
            .result-card .unit {
                font-size: 14px;
                color: #666;
            }
            .defects-section {
                margin-top: 30px;
            }
            .defects-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 15px;
            }
            .defect-item {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                text-align: center;
            }
            .defect-item h5 {
                margin: 0 0 10px 0;
                color: #856404;
            }
            .defect-item .count {
                font-size: 20px;
                font-weight: bold;
                color: #856404;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Relatório de Análise de Grãos</h1>
            <h2>AgroView - Sistema de Classificação</h2>
        </div>

        <div class="info-section">
            <h3>Informações da Análise</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>ID da Análise:</strong><br>
                    ${data.analysisId}
                </div>
                <div class="info-item">
                    <strong>Tipo de Grão:</strong><br>
                    ${data.grainType}
                </div>
                <div class="info-item">
                    <strong>Data da Análise:</strong><br>
                    ${new Date(data.date).toLocaleDateString('pt-BR')}
                </div>
                <div class="info-item">
                    <strong>Hora da Análise:</strong><br>
                    ${new Date(data.date).toLocaleTimeString('pt-BR')}
                </div>
            </div>
        </div>

        <div class="info-section">
            <h3>Resultados da Análise</h3>
            <div class="results-grid">
                <div class="result-card">
                    <h4>Total de Grãos</h4>
                    <div class="value">${data.results.totalGrains}</div>
                    <div class="unit">grãos</div>
                </div>
                <div class="result-card">
                    <h4>Grãos Saudáveis</h4>
                    <div class="value">${data.results.healthyGrains}</div>
                    <div class="unit">grãos</div>
                </div>
                <div class="result-card">
                    <h4>Grãos Defeituosos</h4>
                    <div class="value">${data.results.defectiveGrains}</div>
                    <div class="unit">grãos</div>
                </div>
                <div class="result-card">
                    <h4>Pureza</h4>
                    <div class="value">${data.results.purityPercentage}%</div>
                    <div class="unit">percentual</div>
                </div>
                <div class="result-card">
                    <h4>Impureza</h4>
                    <div class="value">${data.results.impurityPercentage}%</div>
                    <div class="unit">percentual</div>
                </div>
            </div>
        </div>

        <div class="defects-section">
            <h3>Detalhamento dos Defeitos</h3>
            <div class="defects-grid">
                <div class="defect-item">
                    <h5>Grãos Quebrados</h5>
                    <div class="count">${data.results.defectsBreakdown.broken}</div>
                </div>
                <div class="defect-item">
                    <h5>Grãos Danificados</h5>
                    <div class="count">${data.results.defectsBreakdown.damaged}</div>
                </div>
                <div class="defect-item">
                    <h5>Grãos Descoloridos</h5>
                    <div class="count">${data.results.defectsBreakdown.discolored}</div>
                </div>
                <div class="defect-item">
                    <h5>Matéria Estranha</h5>
                    <div class="count">${data.results.defectsBreakdown.foreignMatter}</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Relatório gerado automaticamente pelo sistema AgroView</p>
            <p>Data de geração: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    </body>
    </html>
  `;
};
