import { Router } from 'express';
import { AnalysisController } from '../controllers/analysisController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Todas as rotas de análises requerem autenticação
router.use(authenticateToken);

/**
 * @swagger
 * /api/analyses:
 *   get:
 *     summary: Obter histórico de análises do usuário
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Número máximo de análises a retornar
 *     responses:
 *       200:
 *         description: Histórico de análises obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Histórico de análises obtido com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AnalysisHistory'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', AnalysisController.getAnalysisHistory);

/**
 * @swagger
 * /api/analyses/recent:
 *   get:
 *     summary: Obter análises recentes do usuário
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: Número máximo de análises recentes a retornar
 *     responses:
 *       200:
 *         description: Análises recentes obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Análises recentes obtidas com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AnalysisHistory'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get('/recent', AnalysisController.getRecentAnalyses);

/**
 * @swagger
 * /api/analyses/stats:
 *   get:
 *     summary: Obter estatísticas das análises do usuário
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estatísticas obtidas com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAnalyses:
 *                       type: integer
 *                       description: Total de análises realizadas
 *                     averagePurity:
 *                       type: number
 *                       description: Pureza média
 *                     bestPurity:
 *                       type: number
 *                       description: Melhor pureza obtida
 *                     worstPurity:
 *                       type: number
 *                       description: Pior pureza obtida
 *                     grainTypeBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           grainType:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           averagePurity:
 *                             type: number
 */
router.get('/stats', AnalysisController.getAnalysisStats);

/**
 * @swagger
 * /api/analyses/grain-type/{grainType}:
 *   get:
 *     summary: Obter análises por tipo de grão
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: grainType
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo de grão para filtrar
 *         example: Soja
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Número máximo de análises a retornar
 *     responses:
 *       200:
 *         description: Análises por tipo de grão obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Análises de Soja obtidas com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AnalysisHistory'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     grainType:
 *                       type: string
 */
router.get('/grain-type/:grainType', AnalysisController.getAnalysisByGrainType);

/**
 * @swagger
 * /api/analyses/{id}:
 *   get:
 *     summary: Obter análise específica por ID
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da análise
 *     responses:
 *       200:
 *         description: Análise obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Análise obtida com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Analysis'
 *       404:
 *         description: Análise não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', AnalysisController.getAnalysisById);

/**
 * @swagger
 * /api/analyses/{id}/report:
 *   get:
 *     summary: Download do relatório PDF da análise
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da análise
 *     responses:
 *       200:
 *         description: Relatório PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Nome do arquivo para download
 *             schema:
 *               type: string
 *               example: attachment; filename="relatorio-analise-123.pdf"
 *       404:
 *         description: Análise não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/report', AnalysisController.generateReport);

/**
 * @swagger
 * /api/analyses/{id}/export:
 *   get:
 *     summary: Visualizar relatório PDF da análise no navegador
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da análise
 *     responses:
 *       200:
 *         description: Relatório PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Visualização inline do PDF
 *             schema:
 *               type: string
 *               example: inline; filename="relatorio-analise-123.pdf"
 *       404:
 *         description: Análise não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/export', AnalysisController.exportReport);

/**
 * @swagger
 * /api/analyses/compare:
 *   post:
 *     summary: Comparar múltiplas análises
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - analysisIds
 *             properties:
 *               analysisIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 maxItems: 10
 *                 description: Lista de IDs das análises para comparação
 *                 example: ["analysis_1", "analysis_2", "analysis_3"]
 *     responses:
 *       200:
 *         description: Comparação de análises realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comparação de análises realizada com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/ComparisonResponse'
 *       400:
 *         description: Dados inválidos para comparação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/compare', AnalysisController.compareAnalyses);

/**
 * @swagger
 * /api/analyses/{id}:
 *   delete:
 *     summary: Deletar análise específica
 *     tags: [Análises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da análise
 *     responses:
 *       200:
 *         description: Análise deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Análise deletada com sucesso
 *       404:
 *         description: Análise não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', AnalysisController.deleteAnalysis);

export default router;