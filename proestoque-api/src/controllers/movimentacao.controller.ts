import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

export const criarMovimentacao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { [key: string]: string }; // produtoId
    const { tipo, quantidade, observacao } = req.body;

    if (!tipo || !quantidade) {
      throw new AppError('Tipo e quantidade são obrigatórios', 400);
    }
    if (tipo !== 'entrada' && tipo !== 'saida') {
      throw new AppError('O tipo deve ser "entrada" ou "saida"', 400);
    }
    if (quantidade <= 0) {
      throw new AppError('A quantidade deve ser maior que zero', 400);
    }

    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }

    let novaQuantidade = produto.quantidade;
    if (tipo === 'entrada') {
      novaQuantidade += quantidade;
    } else {
      if (produto.quantidade < quantidade) {
        throw new AppError('Quantidade insuficiente em estoque', 400);
      }
      novaQuantidade -= quantidade;
    }

    const resultado = await prisma.$transaction([
      prisma.movimentacao.create({
        data: {
          tipo,
          quantidade,
          observacao,
          produtoId: id
        }
      }),
      prisma.produto.update({
        where: { id },
        data: { quantidade: novaQuantidade }
      })
    ]);

    res.status(201).json({
      movimentacao: resultado[0],
      produtoAtualizado: resultado[1]
    });
  } catch (error) {
    next(error);
  }
};

export const listarMovimentacoes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { [key: string]: string };

    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }

    const movimentacoes = await prisma.movimentacao.findMany({
      where: { produtoId: id },
      orderBy: { criadoEm: 'desc' }
    });

    res.status(200).json(movimentacoes);
  } catch (error) {
    next(error);
  }
};
