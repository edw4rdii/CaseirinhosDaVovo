import { selecionar } from '../core/dom.js';

export function definirErroCampo(campo, mensagem) {
  const entrada = selecionar('.campo__input', campo);
  const texto = selecionar('[data-campo-mensagem]', campo);
  campo.classList.add('campo--erro');
  entrada.setAttribute('aria-invalid', 'true');
  texto.textContent = mensagem;
  texto.classList.remove('oculto');
}

export function limparErroCampo(campo) {
  const entrada = selecionar('.campo__input', campo);
  const texto = selecionar('[data-campo-mensagem]', campo);
  campo.classList.remove('campo--erro');
  entrada.removeAttribute('aria-invalid');
  texto.textContent = '';
  texto.classList.add('oculto');
}
