import { Router } from 'express';
import produtoRoutes from './produto.routes';
import categoriaRoutes from './categoria.routes';

const router = Router();

router.use('/produtos', produtoRoutes);
router.use('/categorias', categoriaRoutes);

export default router;
