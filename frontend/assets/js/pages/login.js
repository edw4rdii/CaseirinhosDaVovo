import { montarParciais } from '../core/partials.js';
import { selecionar, selecionarTodos } from '../core/dom.js';
import { ouvir } from '../core/eventos.js';
import { ligarCampoSenha } from '../components/campo-senha.js';
import { definirErroCampo, limparErroCampo } from '../components/campo.js';
import { validarObrigatorio } from '../utils/validadores.js';

const MENSAGENS = Object.freeze({
  usuario: 'Informe seu e-mail ou usuário.',
  senha: 'Informe sua senha.',
});

export async function iniciarLogin() {
  await montarParciais();
  ligarCampoSenha();
  ligarFormulario(selecionar('[data-login="formulario"]'));
}

function ligarFormulario(formulario) {
  if (!formulario) return;

  selecionarTodos('[data-campo]', formulario).forEach((campo) => {
    ouvir(selecionar('input', campo), 'input', () => limparErroCampo(campo));
  });

  ouvir(formulario, 'submit', (evento) => {
    evento.preventDefault();
    const dados = new FormData(formulario);
    const invalidos = ['usuario', 'senha'].filter((nome) => {
      const campo = selecionar(`[data-campo="${nome}"]`, formulario);
      const erro = validarObrigatorio(dados.get(nome), MENSAGENS[nome]);
      if (erro) definirErroCampo(campo, erro);
      else limparErroCampo(campo);
      return Boolean(erro);
    });

    if (invalidos.length) {
      selecionar(`[name="${invalidos[0]}"]`, formulario).focus();
      return;
    }

    formulario.dispatchEvent(new CustomEvent('login:enviar', {
      bubbles: true,
      detail: { usuario: dados.get('usuario').trim(), lembrar: dados.get('lembrar') === 'on' },
    }));
  });
}

iniciarLogin();
