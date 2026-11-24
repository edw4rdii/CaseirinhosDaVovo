// Erro "esperado" da API: carrega o status HTTP junto com a mensagem.
// Lance em qualquer camada (validator, service...) e o erros.middleware responde.
export default class ErroHttp extends Error {
  constructor(codigo, mensagem) {
    super(mensagem);
    this.codigo = codigo;
  }
}
