export function ligarSeletorQuantidade(seletor, { minimo = 1, maximo = 99 } = {}) {
  const valor = seletor.querySelector('.seletor-quantidade__valor');
  const [diminuir, aumentar] = seletor.querySelectorAll('.seletor-quantidade__botao');
  let atual = Number(valor.textContent);

  const atualizar = (novo) => {
    atual = Math.min(maximo, Math.max(minimo, novo));
    valor.textContent = String(atual);
    diminuir.disabled = atual <= minimo;
    aumentar.disabled = atual >= maximo;
  };

  diminuir.addEventListener('click', () => atualizar(atual - 1));
  aumentar.addEventListener('click', () => atualizar(atual + 1));
  atualizar(atual);
}
