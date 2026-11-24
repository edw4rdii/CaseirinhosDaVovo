import asyncHandler from "../utils/async-handler.js";
import * as fluxoCaixaService from "../services/fluxo-caixa.service.js";
// Erros lançados pelo service (ErroHttp) chegam ao erros.middleware via asyncHandler.

// GET /api/fluxo-caixa?tipo=&categoria=&dataInicio=&dataFim=
export const controllerFluxoCaixa = asyncHandler(async (req, res) => {
  const lancamentos = await fluxoCaixaService.listar(req.query);
  res.status(200).json(lancamentos);
});

// GET /api/fluxo-caixa/resumo?dataInicio=&dataFim=
export const controllerFluxoCaixaResumo = asyncHandler(async (req, res) => {
  const resumo = await fluxoCaixaService.resumo(req.query);
  res.status(200).json(resumo);
});

// POST /api/fluxo-caixa
export const controllerFluxoCaixaCreate = asyncHandler(async (req, res) => {
  const lancamento = await fluxoCaixaService.criar(req.body);
  res.status(201).json(lancamento);
});

// PUT /api/fluxo-caixa/:id
export const controllerFluxoCaixaUpdate = asyncHandler(async (req, res) => {
  const lancamento = await fluxoCaixaService.atualizar(req.params.id, req.body);
  res.status(200).json(lancamento);
});

// DELETE /api/fluxo-caixa/:id
export const controllerFluxoCaixaDelete = asyncHandler(async (req, res) => {
  await fluxoCaixaService.remover(req.params.id);
  res.status(204).end();
});
