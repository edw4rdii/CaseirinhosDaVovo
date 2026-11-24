export async function carregarParcial(caminho) {
  const resposta = await fetch(caminho);
  if (!resposta.ok) throw new Error('Não foi possível carregar o parcial: ' + caminho);
  return resposta.text();
}

function ajustarCaminhos(html, prefixo) {
  if (!prefixo) return html;
  const modelo = document.createElement('template');
  modelo.innerHTML = html;
  modelo.content.querySelectorAll('[href], [src]').forEach((elemento) => {
    ['href', 'src'].forEach((atributo) => {
      const valor = elemento.getAttribute(atributo);
      if (valor && !/^(#|\/|[a-z][a-z0-9+.-]*:)/i.test(valor)) {
        elemento.setAttribute(atributo, prefixo + valor);
      }
    });
  });
  return modelo.innerHTML;
}

export async function montarParciais(raiz = document) {
  const prefixo = document.body.dataset.raiz ?? '';
  const alvos = Array.from(raiz.querySelectorAll('[data-parcial]'));
  await Promise.all(alvos.map(async (alvo) => {
    const nome = alvo.dataset.parcial;
    const html = await carregarParcial(`${prefixo}partials/${nome}.html`);
    alvo.outerHTML = ajustarCaminhos(html, prefixo);
  }));
}
