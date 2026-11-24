import { montarParciais } from '../core/partials.js';
import { selecionar, selecionarTodos } from '../core/dom.js';
import { ouvir } from '../core/eventos.js';
import { ligarCampoSenha } from '../components/campo-senha.js';
import { definirErroCampo, limparErroCampo } from '../components/campo.js';
import { mascararTelefone } from '../utils/mascaras.js';
import {
  validarEmail,
  validarIgualdade,
  validarMinimo,
  validarObrigatorio,
  validarTelefone,
} from '../utils/validadores.js';

const TAMANHO_MINIMO_SENHA = 8;

const REGRAS = [
  ['nome', (d) => validarObrigatorio(d.nome, 'Informe seu nome completo.')],
  ['email', (d) => validarObrigatorio(d.email, 'Informe seu e-mail.')
    || validarEmail(d.email, 'Insira um e-mail válido, como nome@email.com.')],
  ['telefone', (d) => validarObrigatorio(d.telefone, 'Informe seu telefone ou WhatsApp.')
    || validarTelefone(d.telefone, 'Insira um telefone válido, com DDD.')],
  ['senha', (d) => validarObrigatorio(d.senha, 'Crie uma senha.')
    || validarMinimo(d.senha, TAMANHO_MINIMO_SENHA, `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`)],
  ['confirmacao', (d) => validarObrigatorio(d.confirmacao, 'Confirme sua senha.')
    || validarIgualdade(d.senha, d.confirmacao, 'As senhas não coincidem.')],
  ['termos', (d) => (d.termos ? '' : 'Aceite os termos para continuar.')],
];

export async function iniciarCadastro() {
  await montarParciais();
  ligarCampoSenha();
  ligarFormulario(selecionar('[data-cadastro="formulario"]'));
}

function lerDados(formulario) {
  const dados = new FormData(formulario);
  return {
    nome: dados.get('nome'),
    email: dados.get('email'),
    telefone: dados.get('telefone'),
    senha: dados.get('senha'),
    confirmacao: dados.get('confirmacao'),
    termos: dados.get('termos') === 'on',
  };
}

function ligarFormulario(formulario) {
  if (!formulario) return;

  selecionarTodos('[data-campo]', formulario).forEach((campo) => {
    const entrada = selecionar('input', campo);
    const evento = entrada.type === 'checkbox' ? 'change' : 'input';
    ouvir(entrada, evento, () => limparErroCampo(campo));
  });

  const telefone = selecionar('[name="telefone"]', formulario);
  ouvir(telefone, 'input', () => {
    telefone.value = mascararTelefone(telefone.value);
  });

  ouvir(formulario, 'submit', (evento) => {
    evento.preventDefault();
    const dados = lerDados(formulario);
    const invalidos = REGRAS.filter(([nome, validar]) => {
      const campo = selecionar(`[data-campo="${nome}"]`, formulario);
      const erro = validar(dados);
      if (erro) definirErroCampo(campo, erro);
      else limparErroCampo(campo);
      return Boolean(erro);
    });

    if (invalidos.length) {
      selecionar(`[name="${invalidos[0][0]}"]`, formulario).focus();
      return;
    }

    formulario.dispatchEvent(new CustomEvent('cadastro:enviar', {
      bubbles: true,
      detail: {
        nome: dados.nome.trim(),
        email: dados.email.trim().toLowerCase(),
        telefone: dados.telefone.replace(/\D/g, ''),
        senha: dados.senha,
      },
    }));
  });
}

iniciarCadastro();
