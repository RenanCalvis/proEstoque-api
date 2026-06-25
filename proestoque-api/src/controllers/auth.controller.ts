import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { config } from '../config';

const generateTokens = (id: string) => {
  const accessToken = jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
  
  const refreshToken = jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d',
  });

  return { accessToken, refreshToken };
};

export const registrar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, email, senha } = req.body;

    const emailExiste = await prisma.usuario.findUnique({ where: { email } });
    if (emailExiste) {
      throw new AppError('E-mail já está em uso', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
    });

    const { accessToken, refreshToken } = generateTokens(usuario.id);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { refreshToken },
    });

    res.status(201).json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const { accessToken, refreshToken } = generateTokens(usuario.id);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { refreshToken },
    });

    res.status(200).json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const perfil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuarioId },
      select: { id: true, nome: true, email: true, criadoEm: true },
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token não fornecido', 401);
    }

    const decoded = jwt.verify(refreshToken, config.jwtSecret) as { id: string };

    const usuario = await prisma.usuario.findUnique({ where: { id: decoded.id } });
    if (!usuario || usuario.refreshToken !== refreshToken) {
      throw new AppError('Refresh token inválido', 401);
    }

    const tokens = generateTokens(usuario.id);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { refreshToken: tokens.refreshToken },
    });

    res.status(200).json({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
