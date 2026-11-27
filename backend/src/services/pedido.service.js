import ErroHttp from "../utils/erro-http.js";
import * as repositorio from "../repositories/pedido.repository.js";
import * as produtoRepositorio from "../repositories/produto.repository.js";
import { STATUS_FINAIS } from "../constants/status-pedido.js";
import { paraDataBR, inicioDoDiaBR, fimDoDiaBR } from "../utils/datas.js";

function montarFiltro({ status, dataInicio, dataFim }) {
  const filtro = {};
  if (status) filtro.status = status;
  if (dataInicio || dataFim) {
    filtro.dataEntrega = {};
    if (dataInicio) filtro.dataEntrega.$gte = inicioDoDiaBR(dataInicio);
    if (dataFim) filtro.dataEntrega.$lte = fimDoDiaBR(dataFim);
  }
  return filtro;
}

async function buscarExistente(id) {
  const pedido = await repositorio.buscarPorId(id);
  if (!pedido) throw new ErroHttp(404, "Pedido não encontrado");
  return pedido;
}

function garantirNaoFinalizado(pedido) {
  if (STATUS_FINAIS.includes(pedido.status)) {
    throw new ErroHttp(400, `Pedido ${pedido.status} não pode ser alterado`);
  }
}

// Itens com produtoId usam nome e preço do catálogo; itens avulsos só são aceitos pelo painel.
async function montarItens(itens, origem) {
  if (origem !== "painel" && itens.some((item) => !item.produtoId)) {
    throw new ErroHttp(400, "Itens fora do catálogo só podem ser adicionados pelo painel");
  }

  const ids = itens.filter((item) => item.produtoId).map((item) => item.produtoId);
  const produtos = ids.length ? await produtoRepositorio.buscarPorIds(ids) : [];

  return itens.map((item) => {
    if (!item.produtoId) {
      return { produtoId: null, nome: item.nome.trim(), precoUnitario: item.precoUnitario, quantidade: item.quantidade };
    }
    const produto = produtos.find((p) => p._id.equals(item.produtoId));
    if (!produto) throw new ErroHttp(400, `Produto ${item.produtoId} não encontrado`);
    if (produto.disponivel === false) throw new ErroHttp(400, `Produto "${produto.nome}" está indisponível`);
    return { produtoId: produto._id, nome: produto.nome, precoUnitario: produto.preco, quantidade: item.quantidade };
  });
}

const calcularTotal = (itens) => itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0);

function montarEndereco(tipo, endereco) {
  if (tipo !== "entrega") return null;
  return {
    rua: endereco.rua.trim(),
    numero: endereco.numero.trim(),
    bairro: endereco.bairro.trim(),
    complemento: endereco.complemento?.trim() ?? "",
  };
}

async function montarDados(dados, origem) {
  const itens = await montarItens(dados.itens, origem);
  return {
    cliente: { nome: dados.cliente.nome.trim(), telefone: dados.cliente.telefone.trim() },
    itens,
    total: calcularTotal(itens),
    observacoes: dados.observacoes ?? "",
    tipo: dados.tipo,
    dataEntrega: paraDataBR(dados.dataEntrega),
    endereco: montarEndereco(dados.tipo, dados.endereco),
  };
}

// Mantém status e etapa coerentes quando um dos dois muda.
function statusParaEtapa(etapa, statusAtual) {
  if (etapa === "pronto") return "pronto";
  if (etapa !== "fila") return "em_producao";
  return ["em_producao", "pronto"].includes(statusAtual) ? "confirmado" : statusAtual;
}

function etapaParaStatus(status, etapaAtual) {
  if (["pronto", "entregue"].includes(status)) return "pronto";
  if (status === "em_producao") return ["fila", "pronto"].includes(etapaAtual) ? "preparo" : etapaAtual;
  if (status === "cancelado") return etapaAtual;
  return "fila";
}

export async function listar(query) {
  return repositorio.listar(montarFiltro(query));
}

export async function buscarPorId(id) {
  return buscarExistente(id);
}

export async function criar(dados) {
  const origem = dados.origem ?? "loja";
  const pedido = await montarDados(dados, origem);
  const numero = await repositorio.proximoNumero();
  const agora = new Date();

  return repositorio.inserir({
    codigo: `PED-${String(numero).padStart(4, "0")}`,
    ...pedido,
    status: "recebido",
    etapaProducao: "fila",
    origem,
    criadoEm: agora,
    atualizadoEm: agora,
  });
}

export async function atualizar(id, dados) {
  const existente = await buscarExistente(id);
  garantirNaoFinalizado(existente);

  const pedido = await montarDados(dados, "painel");
  return repositorio.atualizar(id, { ...pedido, atualizadoEm: new Date() });
}

export async function alterarStatus(id, status) {
  const existente = await buscarExistente(id);
  garantirNaoFinalizado(existente);

  return repositorio.atualizar(id, {
    status,
    etapaProducao: etapaParaStatus(status, existente.etapaProducao),
    atualizadoEm: new Date(),
  });
}

export async function alterarEtapa(id, etapa) {
  const existente = await buscarExistente(id);
  garantirNaoFinalizado(existente);

  return repositorio.atualizar(id, {
    etapaProducao: etapa,
    status: statusParaEtapa(etapa, existente.status),
    atualizadoEm: new Date(),
  });
}

export async function cancelar(id) {
  await alterarStatus(id, "cancelado");
}
