export function Header() {
  return `
    <header class="site-header">
      <div class="topbar">
        <a class="brand" href="#" aria-label="Caseirinhos da Vovó - início">
          <img class="brand-logo" src="./src/assets/products/logo.png" alt="" />
          <span class="brand-copy"><strong>Caseirinhos</strong><small>da Vovó</small></span>
        </a>
        <form class="search" role="search">
          <label class="sr-only" for="search-input">O que você procura?</label>
          <input id="search-input" type="search" placeholder="O que você procura" />
          <button type="submit" aria-label="Buscar">⌕</button>
        </form>
        <div class="header-actions" aria-label="Ações da conta">
          <button class="header-action" type="button">♙<span>Central de<br />Atendimento</span></button>
          <button class="header-action" type="button">♧<span>Bem-vindo,<br />Entrar ou cadastrar</span></button>
          <button class="cart-button" type="button" aria-label="Abrir carrinho">🛒<span>0</span></button>
        </div>
      </div>
      <nav class="category-nav" aria-label="Categorias principais">
        <a href="#produtos">Todos os produtos⌄</a>
        <a href="#halloween">Halloween⌄</a>
        <a href="#natal">Natal⌄</a>
        <a href="#chocolates">Chocolate⌄</a>
        <a href="#ingredientes">Ingredientes⌄</a>
        <a href="#decoracao">Decoração⌄</a>
        <a href="#embalagens">Embalagens⌄</a>
        <a href="#moldes">Modelar⌄</a>
      </nav>
    </header>
  `;
}
