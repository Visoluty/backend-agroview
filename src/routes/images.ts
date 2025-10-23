import { Router } from 'express';
import { ImageController } from '../controllers/imageController';
import { authenticateToken } from '../middlewares/auth';
import { uploadSingleImage, handleUploadError, validateFileUpload } from '../middlewares/upload';

const router = Router();

// Todas as rotas de imagens requerem autenticação
router.use(authenticateToken);

// Processar imagem (upload + análise)
router.post('/process', 
  uploadSingleImage, 
  handleUploadError, 
  validateFileUpload, 
  ImageController.processImage
);

// Validar imagem (apenas upload, sem análise)
router.post('/validate', 
  uploadSingleImage, 
  handleUploadError, 
  validateFileUpload, 
  ImageController.validateImage
);

// Obter informações de uma imagem específica
router.get('/info/:filename', ImageController.getImageInfo);

router.delete('/:filename', ImageController.deleteImage);

// Obter formatos suportados
router.get('/formats', ImageController.getSupportedFormats);

export default router;
