import { montarParciais } from '../core/partials.js';
import { selecionar, selecionarTodos } from '../core/dom.js';
import { ouvir } from '../core/eventos.js';
import { obterSessao } from '../core/acesso.js';
import { gravarArmazenado } from '../core/armazenamento.js';
import { identificarUsuarioNoCabecalho } from '../components/cabecalho.js';
import { ligarUpload } from '../components/upload.js';
import { definirErroCampo, limparErroCampo } from '../components/campo.js';
// import { criarEncomenda } from '../services/pedido-service.js';
import { CHAVE_ULTIMO_PEDIDO } from '../services/pedido-service.js';
import { mascararTelefone } from '../utils/mascaras.js';
import { paraInputData, formatarDataInput, converterDataParaISO } from '../utils/datas.js';
import { validarObrigatorio, validarTelefone } from '../utils/validadores.js';

const SEM_VALOR = '—';
// const MENSAGEM_ERRO_ENVIO = 'Não foi possível registrar seu pedido agora. Seus dados foram mantidos, tente novamente em instantes.';

const REGRAS = [
  ['tamanho', (d) => (d.tamanho ? '' : 'Escolha o tamanho do bolo.')],
  ['sabor', (d) => validarObrigatorio(d.sabor, 'Informe o sabor da massa.')],
  ['recheio', (d) => validarObrigatorio(d.recheio, 'Informe o recheio.')],
  ['data', (d, ctx) => {
    if (!d.data) return 'Escolha uma data para o pedido.';
    const dataISO = converterDataParaISO(d.data);
    if (!dataISO) return 'Informe uma data válida no formato DD/MM/AAAA.';
    return dataISO < ctx.hoje ? 'Escolha uma data a partir de hoje.' : '';
  }],
  ['horario', (d) => validarObrigatorio(d.horario, 'Informe o horário.')
    || (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(d.horario) ? '' : 'Informe um horário válido no formato HH:MM.')],
  ['nome', (d) => validarObrigatorio(d.nome, 'Informe seu nome.')],
  ['whatsapp', (d) => validarTelefone(d.whatsapp, 'Informe um WhatsApp válido, com DDD.')],
  ['foto', (d, ctx) => ctx.erroFoto],
];

export async function iniciarEncomenda() {
  await montarParciais();
  identificarUsuarioNoCabecalho();
  ligarFormulario(selecionar('[data-encomenda="formulario"]'));
}

function ligarFormulario(formulario) {
  if (!formulario) return;

  const hoje = paraInputData();
  const estado = { erroFoto: '' };
  const campoDe = (nome) => selecionar(`[data-campo="${nome}"]`, formulario);
  const entradaDe = (nome) => selecionar(`[name="${nome}"]`, formulario);
  const data = entradaDe('data');
  const horario = entradaDe('horario');
  const seletorData = selecionar('[data-seletor="data"]', formulario);
  const seletorHorario = selecionar('[data-seletor-horario]', formulario);
  const horaSeletor = selecionar('[data-horario-hora]', seletorHorario);
  const minutoSeletor = selecionar('[data-horario-minuto]', seletorHorario);
  const botaoSeletorHorario = selecionar('[data-horario-abrir]', formulario);
  seletorData.min = hoje;
  preencherOpcoes(horaSeletor, 24);
  preencherOpcoes(minutoSeletor, 60);

  ouvir(data, 'beforeinput', (evento) => {
    if (evento.data && /[^0-9/]/.test(evento.data)) evento.preventDefault();
  });
  ouvir(data, 'input', () => {
    aplicarMascara(data, 8, '/');
    const dataISO = converterDataParaISO(data.value);
    if (dataISO) seletorData.value = dataISO;
  });
  ouvir(horario, 'beforeinput', (evento) => {
    if (evento.data && /[^0-9:]/.test(evento.data)) evento.preventDefault();
  });
  ouvir(horario, 'input', () => {
    aplicarMascara(horario, 4, ':');
    if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(horario.value)) {
      const [hora, minuto] = horario.value.split(':');
      horaSeletor.value = hora;
      minutoSeletor.value = minuto;
    }
  });
  ouvir(data, 'click', () => {
    if (typeof seletorData.showPicker === 'function') seletorData.showPicker();
    else seletorData.click();
  });
  ouvir(horario, 'click', () => abrirSeletorHorario());
  ouvir(seletorData, 'change', () => {
    data.value = formatarDataInput(seletorData.value);
    data.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const atualizarHorarioPelosSeletores = () => {
    horario.value = `${horaSeletor.value}:${minutoSeletor.value}`;
    horario.dispatchEvent(new Event('input', { bubbles: true }));
  };
  ouvir(horaSeletor, 'change', atualizarHorarioPelosSeletores);
  ouvir(minutoSeletor, 'change', atualizarHorarioPelosSeletores);
  ouvir(botaoSeletorHorario, 'click', () => {
    if (seletorHorario.classList.contains('oculto')) abrirSeletorHorario(true);
    else fecharSeletorHorario();
  });
  ouvir(document, 'click', (evento) => {
    if (!campoDe('horario').contains(evento.target)) {
      fecharSeletorHorario();
    }
  });
  ouvir(seletorHorario, 'keydown', (evento) => {
    if (evento.key === 'Escape') {
      fecharSeletorHorario();
      botaoSeletorHorario.focus();
    }
  });

  function abrirSeletorHorario(focar = false) {
    seletorHorario.classList.remove('oculto');
    seletorHorario.setAttribute('aria-hidden', 'false');
    botaoSeletorHorario.setAttribute('aria-expanded', 'true');
    if (focar) horaSeletor.focus();
  }

  function fecharSeletorHorario() {
    seletorHorario.classList.add('oculto');
    seletorHorario.setAttribute('aria-hidden', 'true');
    botaoSeletorHorario.setAttribute('aria-expanded', 'false');
  }

  const upload = ligarUpload(selecionar('[data-upload]', formulario), {
    aoAlterar: () => {
      estado.erroFoto = '';
      limparErroCampo(campoDe('foto'));
    },
    aoRejeitar: (mensagem) => {
      estado.erroFoto = mensagem;
      definirErroCampo(campoDe('foto'), mensagem);
    },
  });

  const dados = ligarDadosDoCliente(formulario, campoDe, entradaDe);

  ouvir(entradaDe('whatsapp'), 'input', (evento) => {
    evento.target.value = mascararTelefone(evento.target.value);
  });

  const descricao = entradaDe('descricao');
  const contador = selecionar('[data-encomenda="contador"]', formulario);
  ouvir(descricao, 'input', () => {
    contador.textContent = `${descricao.value.length}/${descricao.maxLength}`;
  });

  const atualizar = (evento) => {
    marcarVazios(formulario);
    atualizarResumo(formulario);
    const campo = evento?.target.closest?.('[data-campo]');
    if (campo && campo.dataset.campo !== 'foto') limparErroCampo(campo);
  };
  ouvir(formulario, 'input', atualizar);
  ouvir(formulario, 'change', atualizar);
  marcarVazios(formulario);
  atualizarResumo(formulario);

  ouvir(formulario, 'submit', (evento) => {
    evento.preventDefault();

    const valores = lerValores(formulario);
    const invalidos = REGRAS.filter(([nome, validar]) => {
      const campo = campoDe(nome);
      const erro = validar(valores, { hoje, erroFoto: estado.erroFoto });
      if (erro) definirErroCampo(campo, erro);
      else limparErroCampo(campo);
      return Boolean(erro);
    });

    if (invalidos.length) {
      const [primeiro] = invalidos[0];
      if (['nome', 'whatsapp'].includes(primeiro)) dados.exibirCampos();
      campoDe(primeiro).scrollIntoView({ block: 'center', behavior: 'smooth' });
      entradaDe(primeiro).focus({ preventScroll: true });
      return;
    }

    /* 
    esconderErroEnvio(formulario);
    await enviar(formulario, {
      ...valores,
      data: converterDataParaISO(valores.data),
      foto: upload.obterArquivo(),
    });
    */

    enviar(formulario, {
      ...valores,
      data: converterDataParaISO(valores.data),
      foto: upload.obterArquivo(),
    });
  });
}

function lerValores(formulario) {
  const formData = new FormData(formulario);
  const texto = (nome) => String(formData.get(nome) ?? '').trim();
  return {
    tamanho: texto('tamanho'),
    sabor: texto('sabor'),
    recheio: texto('recheio'),
    tema: texto('tema'),
    mensagem: texto('mensagem'),
    descricao: texto('descricao'),
    restricoes: texto('restricoes'),
    data: texto('data'),
    horario: texto('horario'),
    recebimento: texto('recebimento'),
    nome: texto('nome'),
    whatsapp: texto('whatsapp'),
  };
}

function rotuloEscolhido(formulario, nome) {
  const marcada = selecionar(`[name="${nome}"]:checked`, formulario);
  return marcada ? selecionar('.opcao__titulo', marcada.closest('.opcao')).textContent : '';
}

function montarDataHorario(valores) {
  const dataTexto = valores.data;
  if (dataTexto && valores.horario) return `${dataTexto} às ${valores.horario}`;
  return dataTexto || SEM_VALOR;
}

function montarResumo(formulario, arquivoFoto) {
  const valores = lerValores(formulario);
  return {
    tamanho: rotuloEscolhido(formulario, 'tamanho') || SEM_VALOR,
    sabor: valores.sabor || SEM_VALOR,
    recheio: valores.recheio || SEM_VALOR,
    tema: valores.tema || SEM_VALOR,
    mensagem: valores.mensagem || SEM_VALOR,
    descricao: valores.descricao || SEM_VALOR,
    restricoes: valores.restricoes || SEM_VALOR,
    foto: arquivoFoto?.name || SEM_VALOR,
    dataHorario: montarDataHorario(valores),
    recebimento: rotuloEscolhido(formulario, 'recebimento') || SEM_VALOR,
    nome: valores.nome || SEM_VALOR,
    whatsapp: valores.whatsapp || SEM_VALOR,
    valor: 'A confirmar na aprovação',
  };
}

function aplicarMascara(entrada, limiteDigitos, separador) {
  const posicao = entrada.selectionStart ?? entrada.value.length;
  const digitosAtePosicao = entrada.value.slice(0, posicao).replace(/\D/g, '').length;
  const digitos = entrada.value.replace(/\D/g, '').slice(0, limiteDigitos);
  const posicoesSeparador = separador === '/' ? [2, 4] : [2];

  let valor = '';
  for (let indice = 0; indice < digitos.length; indice += 1) {
    if (posicoesSeparador.includes(indice)) valor += separador;
    valor += digitos[indice];
  }
  entrada.value = valor;

  const separadoresAntesCursor = posicoesSeparador.filter((indice) => (
    indice < digitos.length && indice <= digitosAtePosicao
  )).length;
  const novoCursor = Math.min(digitosAtePosicao, digitos.length) + separadoresAntesCursor;
  entrada.setSelectionRange(novoCursor, novoCursor);
}

function preencherOpcoes(seletor, quantidade) {
  const opcoes = document.createDocumentFragment();
  for (let valor = 0; valor < quantidade; valor += 1) {
    const texto = String(valor).padStart(2, '0');
    const opcao = document.createElement('option');
    opcao.value = texto;
    opcao.textContent = texto;
    opcoes.append(opcao);
  }
  seletor.append(opcoes);
}

function atualizarResumo(formulario) {
  const resumo = montarResumo(formulario);
  selecionarTodos('[data-resumo]', formulario).forEach((alvo) => {
    alvo.textContent = resumo[alvo.dataset.resumo];
  });
}

function marcarVazios(formulario) {
  selecionarTodos('input[type="date"], input[type="time"], .campo__input--data-hora', formulario).forEach((entrada) => {
    entrada.toggleAttribute('data-vazio', !entrada.value);
  });
}

// Visitante: campos nome/WhatsApp. Cliente logado: resumo com os dados da sessão e "Alterar dados".
// A alteração vale apenas para este pedido; salvar no cadastro do cliente depende do backend.
function ligarDadosDoCliente(formulario, campoDe, entradaDe) {
  const secao = selecionar('[data-dados]', formulario);
  const bloco = (nome) => selecionarTodos(`[data-dados-bloco="${nome}"]`, secao);
  const mostrar = (nome, visivel) => bloco(nome).forEach((el) => el.classList.toggle('oculto', !visivel));

  const sessao = obterSessao();
  const cadastrado = sessao && {
    nome: sessao.usuario.nome,
    whatsapp: mascararTelefone(sessao.usuario.telefone),
  };

  function aplicar(modo) {
    mostrar('cliente', modo === 'logado');
    mostrar('campos', modo !== 'logado');
    mostrar('visitante', modo === 'visitante');
    mostrar('restaurar', modo === 'editando');
  }

  function preencherCadastrados() {
    entradaDe('nome').value = cadastrado.nome;
    entradaDe('whatsapp').value = cadastrado.whatsapp;
    ['nome', 'whatsapp'].forEach((nome) => limparErroCampo(campoDe(nome)));
  }

  if (!cadastrado) {
    aplicar('visitante');
    return { exibirCampos: () => {} };
  }

  preencherCadastrados();
  selecionar('[data-dados-nome]', secao).textContent = cadastrado.nome;
  selecionar('[data-dados-telefone]', secao).textContent = cadastrado.whatsapp || SEM_VALOR;
  aplicar('logado');

  ouvir(selecionar('[data-dados-acao="alterar"]', secao), 'click', () => {
    aplicar('editando');
    entradaDe('nome').focus();
  });
  ouvir(selecionar('[data-dados-acao="restaurar"]', secao), 'click', () => {
    preencherCadastrados();
    aplicar('logado');
  });

  return { exibirCampos: () => { if (selecionar('[data-dados-bloco="campos"]', secao).classList.contains('oculto')) aplicar('editando'); } };
}

/*
Fluxo anterior de envio real ao backend, mantido comentado enquanto a rota /pedidos não está ativa.
function esconderErroEnvio(formulario) {
  selecionar('[data-encomenda="erro-envio"]', formulario).classList.add('oculto');
}

async function enviar(formulario, valores) {
  const botao = selecionar('[data-encomenda="enviar"]', formulario);
  const rotulo = botao.textContent;
  botao.disabled = true;
  botao.textContent = 'Enviando…';

  try {
    const pedido = await criarEncomenda(valores);
    gravarArmazenado(CHAVE_ULTIMO_PEDIDO, {
      numero: pedido.numero,
      status: pedido.status,
      telefone: valores.whatsapp,
      resumo: montarResumo(formulario),
    }, { temporario: true });
    window.location.assign('pedido-enviado.html');
  } catch (erro) {
    const aviso = selecionar('[data-encomenda="erro-envio"]', formulario);
    aviso.textContent = erro.rede
      ? 'Sem conexão com o servidor. Seus dados foram mantidos, verifique a internet e tente novamente.'
      : MENSAGEM_ERRO_ENVIO;
    aviso.classList.remove('oculto');
    botao.disabled = false;
    botao.textContent = rotulo;
  }
}
*/

function enviar(formulario, valores) {
  gravarArmazenado(CHAVE_ULTIMO_PEDIDO, {
    demonstracao: true,
    resumo: montarResumo(formulario, valores.foto),
  }, { temporario: true });
  window.location.assign('pedido-enviado.html');
}

iniciarEncomenda();
