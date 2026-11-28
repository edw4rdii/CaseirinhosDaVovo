export function ligarCarrossel(carrossel) {
  const trilho = carrossel.querySelector('.carrossel__trilho');
  const anterior = carrossel.querySelector('.carrossel__seta--anterior');
  const proxima = carrossel.querySelector('.carrossel__seta--proxima');
  if (!trilho) return;

  const botoesIndicadores = criarIndicadores(carrossel, trilho);
  const passo = () => {
    if (carrossel.dataset.carrosselPasso === 'item') {
      return trilho.querySelector('.carrossel__item')?.getBoundingClientRect().width || trilho.clientWidth;
    }
    return trilho.clientWidth * 0.8;
  };
  const atualizarSetas = () => {
    const maximo = trilho.scrollWidth - trilho.clientWidth - 1;
    if (anterior) anterior.disabled = trilho.scrollLeft <= 0;
    if (proxima) proxima.disabled = trilho.scrollLeft >= maximo;
  };
  const atualizarIndicadores = () => {
    if (botoesIndicadores.length === 0) return;

    const centro = trilho.getBoundingClientRect().left + trilho.clientWidth / 2;
    let indiceAtivo = 0;
    let menorDistancia = Infinity;

    trilho.querySelectorAll('.carrossel__item').forEach((item, indice) => {
      const limite = item.getBoundingClientRect();
      const distancia = Math.abs(limite.left + limite.width / 2 - centro);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        indiceAtivo = indice;
      }
    });

    botoesIndicadores.forEach((botao, indice) => {
      if (indice === indiceAtivo) botao.setAttribute('aria-current', 'true');
      else botao.removeAttribute('aria-current');
    });
  };
  const atualizar = () => {
    atualizarSetas();
    atualizarIndicadores();
  };

  anterior?.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }));
  proxima?.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }));
  trilho.addEventListener('scroll', atualizar, { passive: true });
  window.addEventListener('resize', atualizar);
  atualizar();
}

function criarIndicadores(carrossel, trilho) {
  const grupo = carrossel.querySelector('[data-carrossel-indicadores]');
  if (!grupo) return [];

  const itens = Array.from(trilho.querySelectorAll('.carrossel__item'));
  const botoes = itens.map((item, indice) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'banner-vitrine__indicador';
    botao.setAttribute('aria-label', `Ir para o destaque ${indice + 1}`);
    botao.addEventListener('click', () => {
      const deslocamento = item.getBoundingClientRect().left - trilho.getBoundingClientRect().left + trilho.scrollLeft;
      trilho.scrollTo({ left: deslocamento, behavior: 'smooth' });
    });
    return botao;
  });

  grupo.replaceChildren(...botoes);
  return botoes;
}
