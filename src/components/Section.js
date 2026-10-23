import { ProductCard } from "./ProductCard.js";

const halloweenProducts = [
  { image: "product-3.png", name: "Transfer Decorado para Chocolate", price: "R$ 9,90" },
  { image: "product-5.png", name: "Blister Decorado para Chocolate", price: "R$ 4,90" },
  { image: "product-6.png", name: "Forma para Chocolate temática", price: "R$ 9,90", badge: true },
  { image: "product-8.png", name: "Kit Cortador e Carimbo", price: "R$ 10,90" },
  { image: "product-9.png", name: "Cortador Decorado especial", price: "R$ 9,90" },
];

const christmasProducts = [
  { image: "product-10.png", name: "Kit Cortador e Carimbo Natalino", price: "R$ 35,90" },
  { image: "product-12.png", name: "Cortador e Stencil de Natal", price: "R$ 18,90" },
  { image: "product-13.png", name: "Cortador Decorado Natal", price: "R$ 31,90" },
  { image: "product-14.png", name: "Cortador de Natal", price: "R$ 11,90" },
  { image: "product-17.png", name: "Kit Cortadores de Natal", price: "R$ 41,90" },
];

const seasonalProducts = [
  { image: "product-18.png", name: "Forma para Panetone", price: "R$ 28,63", badge: true },
  { image: "product-20.png", name: "Forma de Natal", price: "R$ 9,90" },
  { image: "product-10.png", name: "Forma para chocolate", price: "R$ 6,90" },
  { image: "product-12.png", name: "Papel trufa decorado", price: "R$ 13,90", badge: true },
  { image: "product-13.png", name: "Chocolate em promoção", price: "R$ 29,90" },
];

export function Section({ id, title, banner = false, variant = "halloween" }) {
  if (banner) {
    return `
      <section id="${id}" class="promo-strip">
        <div class="promo-card">
          <div><span>Decore seus</span><strong>doces de Halloween</strong><small>confeite com carinho</small></div>
          <img src="./src/assets/products/box1.png" alt="Doces decorados para Halloween" />
        </div>
        <div class="promo-card">
          <div><span>Formas de</span><strong>Acetato</strong><small>para criar e encantar</small></div>
          <img src="./src/assets/products/banner1.png" alt="Chocolates para confeitaria" />
        </div>
      </section>
    `;
  }

  return `
    <section id="${id}" class="catalog-section">
      <h2>${title}</h2>
      <div class="product-rail">
        <button class="rail-arrow" type="button" aria-label="Produtos anteriores">‹</button>
        <div class="product-grid">
          ${(variant === "christmas" ? christmasProducts : variant === "seasonal" ? seasonalProducts : halloweenProducts).map((product) => ProductCard(product)).join("")}
        </div>
        <button class="rail-arrow" type="button" aria-label="Próximos produtos">›</button>
      </div>
    </section>
  `;
}
