import ErroHttp from "../utils/erro-http.js";
import { TIPOS_LANCAMENTO, CATEGORIAS_FLUXO_CAIXA } from "../constants/categorias-fluxo-caixa.js";
import { dataValida } from "../utils/datas.js";

// Confere o FORMATO dos dados (campos obrigatórios, tipos, valores permitidos).
// Regras de negócio ficam no service.
export function validarLancamento(req, res, next) {
  const { tipo, valor, categoria, descricao, data } = req.body;
  const erros = [];

  if (!TIPOS_LANCAMENTO.includes(tipo)) {
    erros.push(`tipo deve ser: ${TIPOS_LANCAMENTO.join(", ")}`);
  } else if (!CATEGORIAS_FLUXO_CAIXA[tipo].includes(categoria)) {
    erros.push(`categoria para "${tipo}" deve ser: ${CATEGORIAS_FLUXO_CAIXA[tipo].join(", ")}`);
  }

  if (!Number.isInteger(valor) || valor <= 0) {
    erros.push("valor deve ser um inteiro positivo, em centavos (ex.: 2500 = R$ 25,00)");
  }

  if (descricao !== undefined && typeof descricao !== "string") {
    erros.push("descricao deve ser texto");
  }

  if (data !== undefined && !dataValida(data)) {
    erros.push("data inválida (use o formato AAAA-MM-DD)");
  }

  if (erros.length) {
    return next(new ErroHttp(400, erros.join("; ")));
  }
  next();
}
