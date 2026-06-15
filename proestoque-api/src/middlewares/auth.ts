import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      usuarioId?: string;
    }
  }
}

export const autenticar = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não fornecido', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    throw new AppError('Token inválido', 401);
  }
};
