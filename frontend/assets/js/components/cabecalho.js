import { selecionar, criarElemento } from '../core/dom.js';
import { obterSessao } from '../core/acesso.js';

export function identificarUsuarioNoCabecalho() {
  const sessao = obterSessao();
  const atalho = selecionar('[data-cabecalho="usuario"]');
  if (!sessao || !atalho) return;

  const primeiroNome = sessao.usuario.nome.trim().split(/\s+/)[0];
  selecionar('.atalho__rotulo', atalho).replaceChildren(
    criarElemento('small', { texto: 'Bem-vindo(a)' }),
    criarElemento('span', { classes: ['atalho__destaque'], texto: primeiroNome }),
  );
  atalho.setAttribute('href', '#');
}
