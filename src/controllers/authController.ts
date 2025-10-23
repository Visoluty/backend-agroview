import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prismaClient from '../prismaClient';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { TokenService } from '../services/tokenService';
import { asyncHandler, createValidationError, createConflictError, createUnauthorizedError } from '../middlewares/errorHandler';

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  userType: 'PRODUTOR' | 'COOPERATIVA' | 'COMPRADOR';
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    userType: string;
  };
}

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, userType }: UserRegisterRequest = req.body;

    // Validações básicas
    if (!name || !email || !password || !userType) {
      throw createValidationError('Todos os campos são obrigatórios');
    }

    if (password.length < 6) {
      throw createValidationError('A senha deve ter pelo menos 6 caracteres');
    }

    if (!['PRODUTOR', 'COOPERATIVA', 'COMPRADOR'].includes(userType)) {
      throw createValidationError('Tipo de usuário inválido');
    }

    // Verificar se o email já existe
    const existingUser = await prismaClient.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw createConflictError('Email já está em uso');
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        createdAt: true
      }
    });

    // Gerar tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      userType: user.userType
    };

    const token = generateAccessToken(tokenPayload);
    const refreshToken = await TokenService.createRefreshToken(user.id);

    const response: AuthResponse = {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    };

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      data: response
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: UserLoginRequest = req.body;

    // Validações básicas
    if (!email || !password) {
      throw createValidationError('Email e senha são obrigatórios');
    }

    // Buscar usuário
    const user = await prismaClient.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw createUnauthorizedError('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createUnauthorizedError('Credenciais inválidas');
    }

    // Gerar tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      userType: user.userType
    };

    const token = generateAccessToken(tokenPayload);
    const refreshToken = await TokenService.createRefreshToken(user.id);

    const response: AuthResponse = {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    };

    res.json({
      message: 'Login realizado com sucesso',
      data: response
    });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createValidationError('Refresh token é obrigatório');
    }

    // Validar refresh token
    const payload = await TokenService.validateRefreshToken(refreshToken);

    if (!payload) {
      throw createUnauthorizedError('Refresh token inválido ou expirado');
    }

    // Gerar novos tokens
    const newToken = generateAccessToken(payload);
    const newRefreshToken = await TokenService.rotateRefreshToken(refreshToken, payload.userId);

    // Buscar dados do usuário
    const user = await prismaClient.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true
      }
    });

    if (!user) {
      throw createUnauthorizedError('Usuário não encontrado');
    }

    const response: AuthResponse = {
      token: newToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    };

    res.json({
      message: 'Tokens renovados com sucesso',
      data: response
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await TokenService.revokeRefreshToken(refreshToken);
    }

    res.json({
      message: 'Logout realizado com sucesso'
    });
  });

  static logoutAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    await TokenService.revokeAllUserTokens(userId);

    res.json({
      message: 'Logout de todos os dispositivos realizado com sucesso'
    });
  });

  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw createUnauthorizedError('Usuário não encontrado');
    }

    res.json({
      message: 'Perfil obtido com sucesso',
      data: user
    });
  });

  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { name, email } = req.body;

    if (!userId) {
      throw createUnauthorizedError('Usuário não autenticado');
    }

    // Verificar se o email já existe (se foi alterado)
    if (email) {
      const existingUser = await prismaClient.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        throw createConflictError('Email já está em uso');
      }
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email })
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      data: updatedUser
    });
  });
}
