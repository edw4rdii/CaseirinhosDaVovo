import { BANNER_PRINCIPAL, CAMPANHAS, UNIDADE_EXIBICAO } from '../../../data/mocks/home.js';
import { listarVitrines } from '../services/produto-service.js';
import { criarElemento } from '../core/dom.js';
import { montarParciais } from '../core/partials.js';
import { criarCardProduto } from '../components/card-produto.js';
import { ligarSeletorQuantidade } from '../components/seletor-quantidade.js';
import { ligarCarrossel } from '../components/carrossel.js';

export async function iniciarHome() {
  await montarParciais();
  const vitrines = await listarVitrines();
  preencherVitrinePrincipal([BANNER_PRINCIPAL, ...CAMPANHAS]);
  preencherCampanhas(CAMPANHAS);
  preencherVitrines(vitrines);
}

function preencherVitrinePrincipal(destaques) {
  const carrossel = document.querySelector('[data-home="vitrine-principal"]');
  const trilho = carrossel?.querySelector('.carrossel__trilho');
  if (!carrossel || !trilho) return;

  trilho.replaceChildren(...destaques.map((destaque, indice) => {
    const item = criarElemento('div', { classes: ['carrossel__item', 'banner-vitrine__item'] });
    const link = criarElemento('a', {
      classes: ['banner', 'banner-vitrine__slide'],
      atributos: { href: destaque.link },
    });
    const fundo = criarElemento('img', {
      classes: ['banner-vitrine__imagem-fundo'],
      atributos: {
        src: destaque.imagem,
        alt: '',
        loading: indice === 0 ? 'eager' : 'lazy',
        'aria-hidden': 'true',
      },
    });
    const imagem = criarElemento('img', {
      classes: ['banner-vitrine__imagem'],
      atributos: {
        src: destaque.imagem,
        alt: destaque.alt,
        loading: indice === 0 ? 'eager' : 'lazy',
      },
    });

    link.append(fundo, imagem);
    item.append(link);
    return item;
  }));
  ligarCarrossel(carrossel);
}

function preencherCampanhas(campanhas) {
  const grupo = document.querySelector('[data-home="campanhas"]');
  if (!grupo) return;
  grupo.replaceChildren(...campanhas.map((c) => {
    const link = criarElemento('a', { classes: ['banner', 'banner--campanha'], atributos: { href: c.link } });
    link.append(criarElemento('img', { atributos: { src: c.imagem, alt: c.alt, loading: 'lazy' } }));
    return link;
  }));
}

function preencherVitrines(vitrines) {
  const area = document.querySelector('[data-home="vitrines"]');
  if (!area) return;
  area.replaceChildren(...vitrines.map(criarVitrine));
  area.querySelectorAll('[data-carrossel]').forEach(ligarCarrossel);
  area.querySelectorAll('.seletor-quantidade').forEach((s) => ligarSeletorQuantidade(s));
}

function criarVitrine(vitrine) {
  const unidade = UNIDADE_EXIBICAO[vitrine.titulo] || '';
  const id = slug(vitrine.titulo);
  const secao = criarElemento('section', { classes: ['home__vitrine'], atributos: { 'aria-labelledby': id } });
  secao.append(criarElemento('h2', { classes: ['titulo-secao', 'home__vitrine-titulo'], atributos: { id }, texto: vitrine.titulo }));

  const carrossel = criarElemento('div', { classes: ['carrossel'], atributos: { 'data-carrossel': '' } });
  const trilho = criarElemento('div', { classes: ['carrossel__trilho'] });
  trilho.append(...vitrine.produtos.map((p) => {
    const item = criarElemento('div', { classes: ['carrossel__item'] });
    item.append(criarCardProduto(p, { unidade }));
    return item;
  }));
  carrossel.append(
    trilho,
    criarElemento('button', { classes: ['carrossel__seta', 'carrossel__seta--anterior'], atributos: { type: 'button', 'aria-label': 'Produtos anteriores' }, texto: '‹' }),
    criarElemento('button', { classes: ['carrossel__seta', 'carrossel__seta--proxima'], atributos: { type: 'button', 'aria-label': 'Próximos produtos' }, texto: '›' }),
  );
  secao.append(carrossel);
  return secao;
}

function slug(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
}

iniciarHome();
