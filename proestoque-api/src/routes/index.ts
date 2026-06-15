import { Router } from 'express';
import produtoRoutes from './produto.routes';
import categoriaRoutes from './categoria.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/produtos', produtoRoutes);
router.use('/categorias', categoriaRoutes);

export default router;
