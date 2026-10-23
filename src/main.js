import { Home } from "./pages/Home.js";

document.querySelector("#app").innerHTML = Home();

document.addEventListener("click", (event) => {
  const button = event.target.closest(".quantity");
  if (!button) return;

  const quantity = button.parentElement.querySelector(":scope > span");
  const current = Number(quantity.textContent);
  quantity.textContent = String(Math.max(1, button.textContent === "+" ? current + 1 : current - 1));
});

document.querySelector(".search").addEventListener("submit", (event) => {
  event.preventDefault();
});
