import ErroHttp from "../utils/erro-http.js";

// Último middleware do app.js. Padroniza toda resposta de erro em:
// { "erro": { "mensagem": "...", "codigo": 404 } }
// O Express só reconhece como middleware de erro se tiver os 4 parâmetros (mesmo sem usar o next).
export default function tratarErros(erro, req, res, next) {
  if (erro instanceof ErroHttp) {
    return res.status(erro.codigo).json({ erro: { mensagem: erro.message, codigo: erro.codigo } });
  }

  // JSON mal formado no body
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: { mensagem: "JSON inválido no corpo da requisição", codigo: 400 } });
  }

  // Erro inesperado (bug, banco fora do ar...): loga e não expõe detalhes.
  console.error(erro);
  res.status(500).json({ erro: { mensagem: "Erro interno do servidor", codigo: 500 } });
}
