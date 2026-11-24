import ErroHttp from "../utils/erro-http.js";

// Registrado depois de todas as rotas: se chegou aqui, nenhuma rota respondeu.
export default function naoEncontrado(req, res, next) {
  next(new ErroHttp(404, `Rota ${req.method} ${req.originalUrl} não encontrada`));
}
