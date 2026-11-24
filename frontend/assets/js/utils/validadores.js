const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarObrigatorio(valor, mensagem) {
  return String(valor ?? '').trim() ? '' : mensagem;
}

export function validarEmail(valor, mensagem) {
  return PADRAO_EMAIL.test(String(valor ?? '').trim()) ? '' : mensagem;
}

export function validarMinimo(valor, minimo, mensagem) {
  return String(valor ?? '').length >= minimo ? '' : mensagem;
}

export function validarIgualdade(valor, outroValor, mensagem) {
  return valor === outroValor ? '' : mensagem;
}

export function validarTelefone(valor, mensagem) {
  const digitos = String(valor ?? '').replace(/\D/g, '');
  return digitos.length === 10 || digitos.length === 11 ? '' : mensagem;
}
