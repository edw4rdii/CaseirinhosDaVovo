import { Router } from "express";
import {
  controllerPedido,
  controllerPedidoById,
  controllerPedidoCreate,
  controllerPedidoUpdate,
  controllerPedidoStatus,
  controllerPedidoEtapa,
  controllerPedidoDelete
} from "../controllers/pedido.controller.js";
import { validarPedido, validarId } from "../validators/pedido.validator.js";

const router = Router();

router.get("/", controllerPedido);                                      // GET    /api/pedidos
router.get("/:id", validarId, controllerPedidoById);                    // GET    /api/pedidos/:id
router.post("/", validarPedido, controllerPedidoCreate);                // POST   /api/pedidos
router.put("/:id", validarId, validarPedido, controllerPedidoUpdate);   // PUT    /api/pedidos/:id
router.patch("/:id/status", validarId, controllerPedidoStatus);         // PATCH  /api/pedidos/:id/status
router.patch("/:id/etapa", validarId, controllerPedidoEtapa);           // PATCH  /api/pedidos/:id/etapa
router.delete("/:id", validarId, controllerPedidoDelete);               // DELETE /api/pedidos/:id

export default router;