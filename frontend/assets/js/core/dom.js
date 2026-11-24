export function selecionar(seletor, raiz = document) {
  return raiz.querySelector(seletor);
}

export function selecionarTodos(seletor, raiz = document) {
  return Array.from(raiz.querySelectorAll(seletor));
}

export function criarElemento(tag, { classes = [], atributos = {}, texto = '' } = {}) {
  const elemento = document.createElement(tag);
  if (classes.length) elemento.classList.add(...classes);
  Object.entries(atributos).forEach(([nome, valor]) => elemento.setAttribute(nome, valor));
  if (texto) elemento.textContent = texto;
  return elemento;
}
