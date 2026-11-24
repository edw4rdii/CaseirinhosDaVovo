import { criarElemento } from '../core/dom.js';
import { formatarMoeda, formatarParcela } from '../utils/formatadores.js';

export function criarCardProduto(produto, { unidade = '' } = {}) {
  const card = criarElemento('article', { classes: ['card-produto'] });

  const imagem = criarElemento('div', { classes: ['card-produto__imagem'] });
  imagem.append(criarElemento('img', { atributos: { src: produto.imagem, alt: '', loading: 'lazy' } }));
  if (produto.desconto) {
    imagem.append(criarElemento('span', { classes: ['card-produto__selo'], texto: `${produto.desconto}% OFF` }));
  }

  const corpo = criarElemento('div', { classes: ['card-produto__corpo'] });
  corpo.append(criarElemento('h3', { classes: ['card-produto__nome'], texto: produto.nome }));

  const precos = criarElemento('p', { classes: ['card-produto__precos'] });
  if (produto.precoAntigo) {
    precos.append(criarElemento('span', { classes: ['card-produto__preco-antigo'], texto: formatarMoeda(produto.precoAntigo) }));
  }
  precos.append(criarElemento('span', { classes: ['card-produto__preco'], texto: formatarMoeda(produto.preco) + unidade }));
  corpo.append(precos);

  corpo.append(criarElemento('p', { classes: ['card-produto__parcelas'], texto: formatarParcela(produto.preco) }));

  const acoes = criarElemento('div', { classes: ['card-produto__acoes'] });
  acoes.append(criarSeletorQuantidade());
  acoes.append(criarElemento('button', { classes: ['botao', 'botao--primario'], atributos: { type: 'button' }, texto: 'Comprar' }));
  corpo.append(acoes);

  card.append(imagem, corpo);
  return card;
}

function criarSeletorQuantidade() {
  const seletor = criarElemento('div', { classes: ['seletor-quantidade'], atributos: { role: 'group', 'aria-label': 'Quantidade' } });
  seletor.append(
    criarElemento('button', { classes: ['seletor-quantidade__botao'], atributos: { type: 'button', 'aria-label': 'Diminuir quantidade' }, texto: '−' }),
    criarElemento('span', { classes: ['seletor-quantidade__valor'], atributos: { 'aria-live': 'polite' }, texto: '1' }),
    criarElemento('button', { classes: ['seletor-quantidade__botao'], atributos: { type: 'button', 'aria-label': 'Aumentar quantidade' }, texto: '+' }),
  );
  return seletor;
}
