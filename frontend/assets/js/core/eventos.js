export function ouvir(elemento, evento, manipulador, opcoes) {
  if (!elemento) return () => {};
  elemento.addEventListener(evento, manipulador, opcoes);
  return () => elemento.removeEventListener(evento, manipulador, opcoes);
}

export function delegar(raiz, evento, seletor, manipulador) {
  return ouvir(raiz, evento, (e) => {
    const alvo = e.target.closest(seletor);
    if (alvo && raiz.contains(alvo)) manipulador(e, alvo);
  });
}
