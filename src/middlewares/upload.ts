import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { createValidationError } from './errorHandler';

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `grain-analysis-${uniqueSuffix}${extension}`);
  }
});

// Filtro para validar tipos de arquivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(createValidationError(
      `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`
    ));
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB por padrão
    files: 1 // Apenas um arquivo por vez
  }
});

// Middleware para upload de imagem única
export const uploadSingleImage = upload.single('image');

// Middleware para tratamento de erros do multer
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          error: 'Arquivo muito grande. Tamanho máximo permitido: 5MB',
          code: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          error: 'Muitos arquivos. Apenas um arquivo por vez é permitido',
          code: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Campo de arquivo inesperado',
          code: 'UNEXPECTED_FILE_FIELD'
        });
      default:
        return res.status(400).json({
          error: 'Erro no upload do arquivo',
          code: 'UPLOAD_ERROR',
          details: error.message
        });
    }
  }

  if (error.code === 'VALIDATION_ERROR') {
    return res.status(400).json({
      error: error.message,
      code: error.code
    });
  }

  next(error);
};

// Middleware para validar se o arquivo foi enviado
export const validateFileUpload = (req: Request, res: any, next: any) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Nenhum arquivo foi enviado',
      code: 'NO_FILE_UPLOADED'
    });
  }

  next();
};

// Função utilitária para gerar URL do arquivo
export const generateFileUrl = (filename: string): string => {
  return `/uploads/images/${filename}`;
};

// Função para validar extensão do arquivo
export const validateFileExtension = (filename: string): boolean => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const extension = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(extension);
};
