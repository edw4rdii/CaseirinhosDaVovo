import asyncHandler from "../utils/async-handler.js";
import * as pedidoService from "../services/pedido.service.js";

export const controllerPedidos = asyncHandler(async (req, res) => {
  const pedidos = await pedidoService.listar(req.query);
  res.status(200).json(pedidos);
});

export const controllerPedidoPorId = asyncHandler(async (req, res) => {
  const pedido = await pedidoService.buscarPorId(req.params.id);
  res.status(200).json(pedido);
});

export const controllerPedidoCreate = asyncHandler(async (req, res) => {
  const pedido = await pedidoService.criar(req.body);
  res.status(201).json(pedido);
});

export const controllerPedidoUpdate = asyncHandler(async (req, res) => {
  const pedido = await pedidoService.atualizar(req.params.id, req.body);
  res.status(200).json(pedido);
});

export const controllerPedidoStatus = asyncHandler(async (req, res) => {
  const pedido = await pedidoService.alterarStatus(req.params.id, req.body.status);
  res.status(200).json(pedido);
});

export const controllerPedidoEtapa = asyncHandler(async (req, res) => {
  const pedido = await pedidoService.alterarEtapa(req.params.id, req.body.etapa);
  res.status(200).json(pedido);
});

export const controllerPedidoDelete = asyncHandler(async (req, res) => {
  await pedidoService.cancelar(req.params.id);
  res.status(204).end();
});
