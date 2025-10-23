import prismaClient from '../prismaClient';
import { generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';

export class TokenService {
  static async createRefreshToken(userId: string): Promise<string> {
    // Buscar usuário para obter dados do token
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, userType: true }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Gerar novo refresh token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      userType: user.userType
    };

    const refreshToken = generateRefreshToken(tokenPayload);

    // Calcular data de expiração (7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Salvar refresh token no banco
    await prismaClient.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    return refreshToken;
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    await prismaClient.refreshToken.deleteMany({
      where: { token }
    });
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    await prismaClient.refreshToken.deleteMany({
      where: { userId }
    });
  }

  static async validateRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      // Verificar se o token existe no banco e não expirou
      const refreshTokenRecord = await prismaClient.refreshToken.findUnique({
        where: { token },
        include: { user: true }
      });

      if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
        return null;
      }

      // Verificar assinatura do token
      const payload = verifyRefreshToken(token);
      return payload;
    } catch (error) {
      return null;
    }
  }

  static async cleanupExpiredTokens(): Promise<void> {
    await prismaClient.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }

  static async rotateRefreshToken(oldToken: string, userId: string): Promise<string> {
    // Revogar token antigo
    await this.revokeRefreshToken(oldToken);
    
    // Criar novo token
    return await this.createRefreshToken(userId);
  }
}
