import { lerArmazenado } from './armazenamento.js';

// A sessão será gravada pelo fluxo de login quando a autenticação existir.
// Formato esperado: { token, usuario: { nome, telefone } }
export const CHAVE_SESSAO = 'caseirinhos:sessao';

export function obterSessao() {
  const sessao = lerArmazenado(CHAVE_SESSAO);
  return sessao?.usuario?.nome ? sessao : null;
}

export function estaAutenticado() {
  return Boolean(obterSessao());
}
