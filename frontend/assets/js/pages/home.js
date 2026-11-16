const API_URL = 'https://caseirosdavovo.vercel.app/';

async function buscarCatalogo() {
  const resposta = await fetch(`${API_URL}/`);
  const dados = await resposta.json();
  console.log(dados);
}
