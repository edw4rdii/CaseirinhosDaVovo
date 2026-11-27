import {Router} from 'express';
import fluxoCaixaRoutes from './fluxo-caixa.routes.js';
import pedidoRoutes from './pedido.routes.js';

const router = Router();

// Cada módulo novo entra aqui com uma linha:
router.use('/fluxo-caixa', fluxoCaixaRoutes);
router.use('/pedidos', pedidoRoutes);

export default router;