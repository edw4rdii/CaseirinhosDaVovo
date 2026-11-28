import { montarParciais } from '../core/partials.js';
import { selecionar, selecionarTodos } from '../core/dom.js';
import { ouvir } from '../core/eventos.js';
import { lerArmazenado, removerArmazenado } from '../core/armazenamento.js';
import { identificarUsuarioNoCabecalho } from '../components/cabecalho.js';
import { CHAVE_ULTIMO_PEDIDO } from '../services/pedido-service.js';
// import { ROTULOS_STATUS } from '../services/pedido-service.js';
// import { mascararTelefone } from '../utils/mascaras.js';

export async function iniciarPedidoEnviado() {
  const pedido = lerArmazenado(CHAVE_ULTIMO_PEDIDO, { temporario: true });
  /*
  if (!pedido?.numero) {
    window.location.replace('encomenda.html');
    return;
  }
  */
  if (!pedido?.demonstracao || !pedido.resumo) {
    window.location.replace('encomenda.html');
    return;
  }

  await montarParciais();
  identificarUsuarioNoCabecalho();
  preencher(pedido.resumo);

  selecionarTodos('[data-pedido="voltar"], [data-pedido="nova"]').forEach((link) => {
    ouvir(link, 'click', () => removerArmazenado(CHAVE_ULTIMO_PEDIDO, { temporario: true }));
  });
}

function definir(nome, texto) {
  const alvo = selecionar(`[data-pedido="${nome}"]`);
  if (alvo) alvo.textContent = texto;
}

function preencher(resumo) {
  Object.entries(resumo).forEach(([nome, valor]) => definir(nome, String(valor)));
}

/*
function preencher(pedido) {
  definir('numero', String(pedido.numero));
  definir('telefone', mascararTelefone(pedido.telefone));

  const status = selecionar('[data-pedido="status"]');
  status.textContent = ROTULOS_STATUS[pedido.status] ?? pedido.status;
  status.classList.add(`etiqueta-status--${pedido.status}`);

  Object.entries(pedido.resumo).forEach(([nome, valor]) => definir(nome, valor));
}
*/

iniciarPedidoEnviado();
