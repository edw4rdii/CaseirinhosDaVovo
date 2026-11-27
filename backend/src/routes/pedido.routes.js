import { Router } from "express";
import {
  controllerPedidos,
  controllerPedidoPorId,
  controllerPedidoCreate,
  controllerPedidoUpdate,
  controllerPedidoStatus,
  controllerPedidoEtapa,
  controllerPedidoDelete
} from "../controllers/pedido.controller.js";
import { validarPedido, validarStatus, validarEtapa } from "../validators/pedido.validator.js";
import { validarId } from "../middlewares/validacao.middleware.js";

const router = Router();

router.get("/", controllerPedidos);                                           // GET    /api/pedidos
router.get("/:id", validarId, controllerPedidoPorId);                         // GET    /api/pedidos/:id
router.post("/", validarPedido, controllerPedidoCreate);                      // POST   /api/pedidos
router.put("/:id", validarId, validarPedido, controllerPedidoUpdate);         // PUT    /api/pedidos/:id
router.patch("/:id/status", validarId, validarStatus, controllerPedidoStatus); // PATCH  /api/pedidos/:id/status
router.patch("/:id/etapa", validarId, validarEtapa, controllerPedidoEtapa);   // PATCH  /api/pedidos/:id/etapa
router.delete("/:id", validarId, controllerPedidoDelete);                     // DELETE /api/pedidos/:id (cancela)

export default router;
