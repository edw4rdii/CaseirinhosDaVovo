import ErroHttp from "../utils/erro-http.js";
import * as repositorio from "../repositories/fluxo-caixa.repository.js";
import { paraDataBR, inicioDoDiaBR, fimDoDiaBR } from "../utils/datas.js";

// Regras de negócio do fluxo de caixa. Não conhece req/res nem o MongoDB direto.

// Monta o filtro do Mongo a partir da query string (?tipo=&categoria=&dataInicio=&dataFim=)
function montarFiltro({ tipo, categoria, dataInicio, dataFim }) {
  const filtro = {};
  if (tipo) filtro.tipo = tipo;
  if (categoria) filtro.categoria = categoria;
  if (dataInicio || dataFim) {
    filtro.data = {};
    if (dataInicio) filtro.data.$gte = inicioDoDiaBR(dataInicio);
    if (dataFim) filtro.data.$lte = fimDoDiaBR(dataFim);
  }
  return filtro;
}

export async function listar(query) {
  return repositorio.listar(montarFiltro(query));
}

export async function resumo(query) {
  const somas = await repositorio.somarPorTipo(montarFiltro(query));
  const entradas = somas.find((s) => s._id === "entrada")?.total ?? 0;
  const saidas = somas.find((s) => s._id === "saida")?.total ?? 0;
  return { entradas, saidas, saldo: entradas - saidas };
}

export async function criar(dados) {
  const agora = new Date(); // o instante atual não precisa de ajuste: UTC é o mesmo momento no mundo todo
  return repositorio.inserir({
    tipo: dados.tipo,
    valor: dados.valor,
    categoria: dados.categoria,
    descricao: dados.descricao ?? "",
    pedidoId: null, // lançamento manual; os automáticos (de pedido) virão do pedido.service
    data: dados.data ? paraDataBR(dados.data) : agora,
    criadoEm: agora,
  });
}

export async function atualizar(id, dados) {
  const existente = await repositorio.buscarPorId(id);
  if (!existente) throw new ErroHttp(404, "Lançamento não encontrado");

  // Regra de negócio: lançamento gerado por um pedido não é editado à mão.
  if (existente.pedidoId) {
    throw new ErroHttp(400, "Lançamento vinculado a um pedido não pode ser editado manualmente");
  }

  return repositorio.atualizar(id, {
    tipo: dados.tipo,
    valor: dados.valor,
    categoria: dados.categoria,
    descricao: dados.descricao ?? existente.descricao,
    data: dados.data ? paraDataBR(dados.data) : existente.data,
  });
}

export async function remover(id) {
  const removido = await repositorio.remover(id);
  if (!removido) throw new ErroHttp(404, "Lançamento não encontrado");
}
