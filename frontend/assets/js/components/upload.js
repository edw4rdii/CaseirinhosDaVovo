import { CONFIG } from '../core/config.js';
import { selecionar } from '../core/dom.js';
import { ouvir } from '../core/eventos.js';
import { formatarTamanhoArquivo } from '../utils/formatadores.js';

export function validarArquivoImagem(arquivo) {
  if (!CONFIG.upload.tiposAceitos.includes(arquivo.type)) return 'Envie uma imagem em JPG ou PNG.';
  if (arquivo.size > CONFIG.upload.tamanhoMaximoBytes) return 'A imagem deve ter no máximo 5 MB.';
  return '';
}

export function ligarUpload(raiz, { aoAlterar = () => {}, aoRejeitar = () => {} } = {}) {
  const entrada = selecionar('[data-upload-input]', raiz);
  const area = selecionar('[data-upload-area]', raiz);
  const painel = selecionar('[data-upload-arquivo]', raiz);
  const nome = selecionar('[data-upload-nome]', raiz);
  const tamanho = selecionar('[data-upload-tamanho]', raiz);
  const remover = selecionar('[data-upload-remover]', raiz);

  function exibirArquivo(arquivo) {
    nome.textContent = arquivo.name;
    tamanho.textContent = formatarTamanhoArquivo(arquivo.size);
    area.classList.add('oculto');
    painel.classList.remove('oculto');
  }

  function limpar() {
    entrada.value = '';
    painel.classList.add('oculto');
    area.classList.remove('oculto');
  }

  function receber(arquivo) {
    if (!arquivo) return;
    const erro = validarArquivoImagem(arquivo);
    if (erro) {
      limpar();
      aoRejeitar(erro);
      return;
    }
    const transferencia = new DataTransfer();
    transferencia.items.add(arquivo);
    entrada.files = transferencia.files;
    exibirArquivo(arquivo);
    aoAlterar(arquivo);
  }

  ouvir(entrada, 'change', () => receber(entrada.files[0]));
  ouvir(remover, 'click', () => {
    limpar();
    aoAlterar(null);
  });

  ouvir(area, 'dragover', (evento) => {
    evento.preventDefault();
    area.classList.add('upload__area--arrastando');
  });
  ouvir(area, 'dragleave', () => area.classList.remove('upload__area--arrastando'));
  ouvir(area, 'drop', (evento) => {
    evento.preventDefault();
    area.classList.remove('upload__area--arrastando');
    receber(evento.dataTransfer.files[0]);
  });

  return { obterArquivo: () => entrada.files[0] ?? null };
}
