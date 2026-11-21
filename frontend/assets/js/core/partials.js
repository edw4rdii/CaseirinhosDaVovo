export async function carregarParcial(caminho) {
  const resposta = await fetch(caminho);
  if (!resposta.ok) throw new Error('Não foi possível carregar o parcial: ' + caminho);
  return resposta.text();
}

export async function montarParciais(raiz = document) {
  const alvos = Array.from(raiz.querySelectorAll('[data-parcial]'));
  await Promise.all(alvos.map(async (alvo) => {
    const nome = alvo.dataset.parcial;
    alvo.outerHTML = await carregarParcial(`partials/${nome}.html`);
  }));
}
