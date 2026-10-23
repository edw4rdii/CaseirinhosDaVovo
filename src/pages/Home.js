import { Header } from "../components/Header.js";
import { Section } from "../components/Section.js";

export function Home() {
  return `
    ${Header()}
    <main>
      <section class="hero">
        <img src="./src/assets/products/banner3.png" alt="Promoção de chocolates: motivos para sorrir" />
      </section>
      <div class="benefits" aria-label="Benefícios da loja">
        <span>🚚 Frete grátis <small>consulte regiões</small></span>
        <span>♢ Entrega rápida <small>para todo Brasil</small></span>
        <span>▣ Envio seguro <small>embalagem protegida</small></span>
        <span>▤ Compra protegida <small>tranquilidade do seu jeito</small></span>
      </div>
      <div class="home-content">
        <section class="brand-section">
          <h1>Escolha por marca</h1>
          <div class="brand-list" aria-label="Marcas">
            <span>fabl</span><span>mix</span><span>ARCOLOR</span><span>GranChef</span><span>flexarte</span>
          </div>
        </section>
        ${Section({ id: "halloween", title: "Blister, Transfer e Stencil de Halloween" })}
        ${Section({ id: "produtos", title: "Cortadores e Carimbos de Halloween" })}
        ${Section({ id: "moldes", title: "Formas e Moldes de Halloween" })}
        ${Section({ id: "decoracao", title: "Mesa Posta de Halloween" })}
        ${Section({ id: "embalagens", title: "Embalagens e Formas de Natal", banner: true })}
        ${Section({ id: "natal", title: "Cortadores e Ejetores de Natal", variant: "christmas" })}
        ${Section({ id: "caixas", title: "Caixas para Doces de Natal", variant: "christmas" })}
        ${Section({ id: "ingredientes", title: "Latas de Natal", variant: "christmas" })}
        ${Section({ id: "chocolates", title: "Formas para Panetone", variant: "seasonal" })}
        ${Section({ id: "promocoes", title: "Chocolate em Promoção", variant: "seasonal" })}
      </div>
    </main>
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-company">
          <div class="footer-brand"><img class="footer-logo" src="./src/assets/products/logo.png" alt="" /><strong>Caseirinhos da Vovó</strong></div>
          <p>Rua dos Doces, 120 - Centro<br />São Paulo - SP</p>
          <span>Atendimento online para todo o Brasil</span>
        </div>
        <div class="footer-contact">
          <strong>Estamos no WhatsApp</strong>
          <span>(11) 99999-9999</span>
          <span>Envie uma mensagem para a nossa equipe</span>
          <span>Horário de atendimento: segunda a sexta, 8h às 18h</span>
          <button type="button">✉ Enviar mensagem</button>
        </div>
        <div class="footer-social">
          <strong>Redes sociais</strong>
          <span>Fique por dentro das novidades</span>
          <div class="social-links">
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="Facebook">f</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">Caseirinhos da Vovó · Todos os direitos reservados · Política de privacidade · Termos de uso</div>
    </footer>
  `;
}
