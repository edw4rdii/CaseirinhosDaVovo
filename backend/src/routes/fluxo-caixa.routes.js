import { Router } from "express";
import {
  controllerFluxoCaixa,
  controllerFluxoCaixaResumo,
  controllerFluxoCaixaCreate,
  controllerFluxoCaixaUpdate,
  controllerFluxoCaixaDelete
} from "../controllers/fluxo-caixa.controller.js";
import { validarLancamento, validarId } from "../validators/fluxo-caixa.validator.js";

const router = Router();

// O prefixo "/api/fluxo-caixa" já vem do routes/index.js — aqui só o resto do caminho.
// Os validators rodam antes do controller: se o body for inválido, já responde 400.
router.get("/", controllerFluxoCaixa);                                        // GET    /api/fluxo-caixa
router.get("/resumo", controllerFluxoCaixaResumo);                            // GET    /api/fluxo-caixa/resumo
router.post("/", validarLancamento, controllerFluxoCaixaCreate);              // POST   /api/fluxo-caixa
router.put("/:id", validarId, validarLancamento, controllerFluxoCaixaUpdate); // PUT    /api/fluxo-caixa/:id
router.delete("/:id", validarId, controllerFluxoCaixaDelete);                 // DELETE /api/fluxo-caixa/:id

export default router;