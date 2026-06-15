import { Router } from 'express';
import * as produtoController from '../controllers/produto.controller';
import * as movimentacaoController from '../controllers/movimentacao.controller';
import { autenticar } from '../middlewares/auth';

const router = Router();

router.use(autenticar);

router.get('/', produtoController.listar);
router.post('/', produtoController.criar);
router.get('/:id', produtoController.buscarPorId);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.deletar);

router.post('/:id/movimentacao', movimentacaoController.criarMovimentacao);
router.get('/:id/movimentacoes', movimentacaoController.listarMovimentacoes);

export default router;
