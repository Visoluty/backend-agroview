import { Router } from 'express';
import { AnalysisController } from '../controllers/analysisController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Todas as rotas de análises requerem autenticação
router.use(authenticateToken);

router.get('/', AnalysisController.getAnalysisHistory);
router.get('/recent', AnalysisController.getRecentAnalyses);
router.get('/stats', AnalysisController.getAnalysisStats);
router.get('/grain-type/:grainType', AnalysisController.getAnalysisByGrainType);
router.get('/:id', AnalysisController.getAnalysisById);

// Gerar relatório em PDF (download)
router.get('/:id/report', AnalysisController.generateReport);

// Exportar relatório em PDF (visualização)
router.get('/:id/export', AnalysisController.exportReport);

router.post('/compare', AnalysisController.compareAnalyses);
router.delete('/:id', AnalysisController.deleteAnalysis);

export default router;
