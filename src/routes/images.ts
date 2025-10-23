import { Router } from 'express';
import { ImageController } from '../controllers/imageController';
import { authenticateToken } from '../middlewares/auth';
import { uploadSingleImage, handleUploadError, validateFileUpload } from '../middlewares/upload';

const router = Router();

// Todas as rotas de imagens requerem autenticação
router.use(authenticateToken);

/**
 * @swagger
 * /api/images/process:
 *   post:
 *     summary: Upload e processamento de imagem de grãos
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - grainType
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem (JPEG, PNG, JPG - máximo 5MB)
 *               grainType:
 *                 type: string
 *                 description: Tipo de grão para análise
 *                 example: Soja
 *                 enum: [Soja, Milho, Trigo, Arroz, Feijão, Café, Aveia, Cevada, Sorgo, Girassol]
 *     responses:
 *       201:
 *         description: Imagem processada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem processada com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/ProcessImageResponse'
 *       400:
 *         description: Erro no upload ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/process', 
  uploadSingleImage, 
  handleUploadError, 
  validateFileUpload, 
  ImageController.processImage
);

/**
 * @swagger
 * /api/images/validate:
 *   post:
 *     summary: Validar imagem (apenas upload, sem análise)
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem para validação
 *     responses:
 *       200:
 *         description: Imagem validada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem validada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     originalName:
 *                       type: string
 *                     mimetype:
 *                       type: string
 *                     size:
 *                       type: integer
 *                     url:
 *                       type: string
 *       400:
 *         description: Erro na validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/validate', 
  uploadSingleImage, 
  handleUploadError, 
  validateFileUpload, 
  ImageController.validateImage
);

/**
 * @swagger
 * /api/images/info/{filename}:
 *   get:
 *     summary: Obter informações de uma imagem específica
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do arquivo da imagem
 *     responses:
 *       200:
 *         description: Informações da imagem obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Informações da imagem obtidas com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     url:
 *                       type: string
 *       400:
 *         description: Nome do arquivo inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/info/:filename', ImageController.getImageInfo);

/**
 * @swagger
 * /api/images/{filename}:
 *   delete:
 *     summary: Deletar imagem
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do arquivo da imagem
 *     responses:
 *       200:
 *         description: Imagem deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem deletada com sucesso
 *       400:
 *         description: Nome do arquivo inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:filename', ImageController.deleteImage);

/**
 * @swagger
 * /api/images/formats:
 *   get:
 *     summary: Obter formatos de arquivo suportados
 *     tags: [Imagens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Formatos suportados obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Formatos suportados obtidos com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageTypes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["image/jpeg", "image/png", "image/jpg"]
 *                     extensions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [".jpg", ".jpeg", ".png"]
 *                     maxSize:
 *                       type: integer
 *                       example: 5242880
 *                     maxSizeFormatted:
 *                       type: string
 *                       example: "5MB"
 */
router.get('/formats', ImageController.getSupportedFormats);

export default router;