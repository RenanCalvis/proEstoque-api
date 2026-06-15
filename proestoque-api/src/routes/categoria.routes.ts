import { Router } from 'express';
import * as categoriaController from '../controllers/categoria.controller';

const router = Router();

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.buscarPorId);

export default router;
