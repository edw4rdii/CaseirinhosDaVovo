import { CONFIG } from '../core/config.js';
import { obterSessao } from '../core/acesso.js';

export class ErroApi extends Error {
  constructor(mensagem, { status = 0, rede = false } = {}) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.rede = rede;
  }
}

// Com corpo FormData o navegador define o Content-Type (multipart) sozinho.
export async function requisitar(caminho, { metodo = 'GET', corpo, cabecalhos = {} } = {}) {
  const token = obterSessao()?.token;
  const opcoes = { method: metodo, headers: { ...cabecalhos } };
  if (token) opcoes.headers.Authorization = `Bearer ${token}`;
  if (corpo !== undefined) opcoes.body = corpo;

  let resposta;
  try {
    resposta = await fetch(`${CONFIG.apiBase}${caminho}`, opcoes);
  } catch {
    throw new ErroApi('Sem conexão com o servidor.', { rede: true });
  }

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new ErroApi(dados?.mensagem ?? dados?.erro ?? 'Não foi possível concluir a solicitação.', { status: resposta.status });
  }
  return dados;
}
