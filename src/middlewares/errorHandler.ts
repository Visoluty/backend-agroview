import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Erro interno do servidor';
  let code = error.code || 'INTERNAL_ERROR';

  // Erros do Prisma
  if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Erro na operação do banco de dados';
    code = 'DATABASE_ERROR';
  }

  // Erros de validação do Prisma
  if (error.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Dados inválidos fornecidos';
    code = 'VALIDATION_ERROR';
  }

  // Erros de JWT
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
    code = 'INVALID_TOKEN';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
    code = 'TOKEN_EXPIRED';
  }

  // Erros de sintaxe JSON
  if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = 'JSON inválido';
    code = 'INVALID_JSON';
  }

  // Log do erro em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      statusCode,
      code,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  // Resposta de erro
  const errorResponse = {
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  };

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(
    `Rota não encontrada: ${req.method} ${req.path}`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Funções utilitárias para criar erros específicos
export const createValidationError = (message: string) => {
  return new CustomError(message, 400, 'VALIDATION_ERROR');
};

export const createUnauthorizedError = (message: string = 'Não autorizado') => {
  return new CustomError(message, 401, 'UNAUTHORIZED');
};

export const createForbiddenError = (message: string = 'Acesso negado') => {
  return new CustomError(message, 403, 'FORBIDDEN');
};

export const createNotFoundError = (message: string = 'Recurso não encontrado') => {
  return new CustomError(message, 404, 'NOT_FOUND');
};

export const createConflictError = (message: string = 'Conflito de dados') => {
  return new CustomError(message, 409, 'CONFLICT');
};
