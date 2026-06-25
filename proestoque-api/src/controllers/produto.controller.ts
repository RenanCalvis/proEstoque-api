import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

export const listar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: { categoria: true }
    });
    res.status(200).json(produtos);
  } catch (error) {
    next(error);
  }
};

export const buscarPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { [key: string]: string };
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { categoria: true, movimentacoes: true }
    });

    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }

    res.status(200).json(produto);
  } catch (error) {
    next(error);
  }
};

export const criar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, categoriaId, quantidade, quantidadeMinima, preco, unidade, foto, observacao } = req.body;

    if (!nome || !categoriaId || quantidade === undefined || quantidadeMinima === undefined || preco === undefined) {
      throw new AppError('Nome, categoria, quantidade, quantidadeMinima e preco são obrigatórios', 400);
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        categoriaId,
        quantidade,
        quantidadeMinima,
        preco,
        unidade: unidade || 'un',
        foto,
        observacao
      }
    });

    res.status(201).json(produto);
  } catch (error) {
    next(error);
  }
};

export const atualizar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { [key: string]: string };
    const data = req.body;

    const produtoExiste = await prisma.produto.findUnique({ where: { id } });
    if (!produtoExiste) {
      throw new AppError('Produto não encontrado', 404);
    }

    const produto = await prisma.produto.update({
      where: { id },
      data
    });

    res.status(200).json(produto);
  } catch (error) {
    next(error);
  }
};

export const deletar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { [key: string]: string };

    const produtoExiste = await prisma.produto.findUnique({ where: { id } });
    if (!produtoExiste) {
      throw new AppError('Produto não encontrado', 404);
    }

    await prisma.produto.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
