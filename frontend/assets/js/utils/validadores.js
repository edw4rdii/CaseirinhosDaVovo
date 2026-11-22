export function validarObrigatorio(valor, mensagem) {
  return String(valor ?? '').trim() ? '' : mensagem;
}
