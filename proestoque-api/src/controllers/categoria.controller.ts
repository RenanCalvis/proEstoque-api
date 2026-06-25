import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

export const listar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: { _count: { select: { produtos: true } } }
    });
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
};

export const buscarPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { [key: string]: string };
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { produtos: true }
    });

    if (!categoria) {
      throw new AppError('Categoria não encontrada', 404);
    }

    res.status(200).json(categoria);
  } catch (error) {
    next(error);
  }
};
