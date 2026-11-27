import { ObjectId } from "mongodb";
import ErroHttp from "../utils/erro-http.js";
import { STATUS_PEDIDO } from "../constants/status-pedido.js";
import { ETAPAS_PRODUCAO } from "../constants/etapas-producao.js";
import { TIPOS_PEDIDO, ORIGENS_PEDIDO } from "../constants/tipos-pedido.js";
import { dataValida } from "../utils/datas.js";

const textoPreenchido = (valor) => typeof valor === "string" && valor.trim() !== "";

function validarItem(item, posicao) {
  const erros = [];
  if (!item || typeof item !== "object") return [`itens[${posicao}] inválido`];

  if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
    erros.push(`itens[${posicao}].quantidade deve ser um inteiro maior que zero`);
  }

  if (item.produtoId != null) {
    if (!ObjectId.isValid(item.produtoId)) erros.push(`itens[${posicao}].produtoId inválido`);
  } else {
    if (!textoPreenchido(item.nome)) erros.push(`itens[${posicao}] precisa de produtoId ou nome`);
    if (!Number.isInteger(item.precoUnitario) || item.precoUnitario <= 0) {
      erros.push(`itens[${posicao}].precoUnitario deve ser um inteiro positivo, em centavos`);
    }
  }
  return erros;
}

export function validarPedido(req, res, next) {
  const { cliente, itens, observacoes, tipo, dataEntrega, endereco, origem } = req.body;
  const erros = [];

  if (!cliente || typeof cliente !== "object") {
    erros.push("cliente é obrigatório (nome e telefone)");
  } else {
    if (!textoPreenchido(cliente.nome)) erros.push("cliente.nome é obrigatório");
    const digitos = String(cliente.telefone ?? "").replace(/\D/g, "");
    if (digitos.length !== 10 && digitos.length !== 11) erros.push("cliente.telefone inválido (DDD + número)");
  }

  if (!Array.isArray(itens) || itens.length === 0) {
    erros.push("itens deve ter pelo menos um item");
  } else {
    itens.forEach((item, i) => erros.push(...validarItem(item, i)));
  }

  if (observacoes !== undefined && typeof observacoes !== "string") {
    erros.push("observacoes deve ser texto");
  }

  if (!TIPOS_PEDIDO.includes(tipo)) {
    erros.push(`tipo deve ser: ${TIPOS_PEDIDO.join(", ")}`);
  }

  if (dataEntrega === undefined || !dataValida(dataEntrega)) {
    erros.push("dataEntrega inválida (use o formato AAAA-MM-DD ou AAAA-MM-DDTHH:MM)");
  }

  if (tipo === "entrega") {
    if (!endereco || typeof endereco !== "object") {
      erros.push("endereco é obrigatório para entrega (rua, numero, bairro)");
    } else {
      ["rua", "numero", "bairro"].forEach((campo) => {
        if (!textoPreenchido(endereco[campo])) erros.push(`endereco.${campo} é obrigatório`);
      });
      if (endereco.complemento !== undefined && typeof endereco.complemento !== "string") {
        erros.push("endereco.complemento deve ser texto");
      }
    }
  }

  if (origem !== undefined && !ORIGENS_PEDIDO.includes(origem)) {
    erros.push(`origem deve ser: ${ORIGENS_PEDIDO.join(", ")}`);
  }

  if (erros.length) {
    return next(new ErroHttp(400, erros.join("; ")));
  }
  next();
}

export function validarStatus(req, res, next) {
  if (!STATUS_PEDIDO.includes(req.body.status)) {
    return next(new ErroHttp(400, `status deve ser: ${STATUS_PEDIDO.join(", ")}`));
  }
  next();
}

export function validarEtapa(req, res, next) {
  if (!ETAPAS_PRODUCAO.includes(req.body.etapa)) {
    return next(new ErroHttp(400, `etapa deve ser: ${ETAPAS_PRODUCAO.join(", ")}`));
  }
  next();
}
