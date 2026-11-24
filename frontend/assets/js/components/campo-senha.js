import { selecionar, selecionarTodos } from '../core/dom.js';
import { ouvir } from '../core/eventos.js';

export function ligarCampoSenha(raiz = document) {
  selecionarTodos('[data-campo-senha]', raiz).forEach((campo) => {
    const entrada = selecionar('input', campo);
    const botao = selecionar('[data-campo-senha-alternar]', campo);
    const iconeMostrar = selecionar('[data-icone="mostrar"]', botao);
    const iconeOcultar = selecionar('[data-icone="ocultar"]', botao);

    ouvir(botao, 'click', () => {
      const tornarVisivel = entrada.type === 'password';
      entrada.type = tornarVisivel ? 'text' : 'password';
      botao.setAttribute('aria-pressed', String(tornarVisivel));
      botao.setAttribute('aria-label', tornarVisivel ? 'Ocultar senha' : 'Mostrar senha');
      iconeMostrar.classList.toggle('oculto', tornarVisivel);
      iconeOcultar.classList.toggle('oculto', !tornarVisivel);
    });
  });
}
