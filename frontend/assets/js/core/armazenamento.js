function obterArea(temporario) {
  try {
    return temporario ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function lerArmazenado(chave, { temporario = false } = {}) {
  try {
    const texto = obterArea(temporario)?.getItem(chave);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

export function gravarArmazenado(chave, valor, { temporario = false } = {}) {
  try {
    obterArea(temporario)?.setItem(chave, JSON.stringify(valor));
  } catch {
    // armazenamento indisponível (modo privado, cota cheia): segue sem persistir
  }
}

export function removerArmazenado(chave, { temporario = false } = {}) {
  try {
    obterArea(temporario)?.removeItem(chave);
  } catch {
    // sem ação
  }
}
