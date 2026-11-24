export function ligarCarrossel(carrossel) {
  const trilho = carrossel.querySelector('.carrossel__trilho');
  const anterior = carrossel.querySelector('.carrossel__seta--anterior');
  const proxima = carrossel.querySelector('.carrossel__seta--proxima');
  if (!trilho) return;

  const passo = () => trilho.clientWidth * 0.8;
  const atualizarSetas = () => {
    const maximo = trilho.scrollWidth - trilho.clientWidth - 1;
    if (anterior) anterior.disabled = trilho.scrollLeft <= 0;
    if (proxima) proxima.disabled = trilho.scrollLeft >= maximo;
  };

  anterior?.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }));
  proxima?.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }));
  trilho.addEventListener('scroll', atualizarSetas, { passive: true });
  window.addEventListener('resize', atualizarSetas);
  atualizarSetas();
}
