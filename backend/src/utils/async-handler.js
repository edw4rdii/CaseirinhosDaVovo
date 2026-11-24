// O Express 4 não captura erro de função async sozinho.
// Envolver o controller com asyncHandler manda qualquer erro para o erros.middleware.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
