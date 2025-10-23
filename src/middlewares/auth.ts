import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

// Estender a interface Request para incluir user - Luís Gustavo.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload | undefined;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso necessário',
        code: 'MISSING_TOKEN'
      });
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({
        error: 'Token inválido ou expirado',
        code: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      } catch (error) {
        // Token inválido, mas não bloqueia a requisição
        req.user = undefined;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

export const requireUserType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticação necessária',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        error: 'Tipo de usuário não autorizado',
        code: 'UNAUTHORIZED_USER_TYPE',
        required: allowedTypes,
        current: req.user.userType
      });
    }

    next();
  };
};
