export function ProductCard({ image, name, price, oldPrice, badge = false }) {
  return `
    <article class="product-card">
      ${badge ? '<span class="product-badge">OFERTA</span>' : ""}
      <div class="product-image-wrap">
        <img src="./src/assets/products/${image}" alt="${name}" class="product-image" />
      </div>
      <div class="product-info">
        ${oldPrice ? `<del>${oldPrice}</del>` : '<span class="old-price-space"></span>'}
        <strong class="product-price">${price}</strong>
        <small>ou em até 4x sem juros</small>
        <div class="buy-row">
          <button class="quantity" type="button" aria-label="Diminuir quantidade">−</button>
          <span>1</span>
          <button class="quantity" type="button" aria-label="Aumentar quantidade">+</button>
          <button class="buy-button" type="button">Comprar</button>
        </div>
      </div>
    </article>
  `;
}
