const API_URL = 'https://caseirosdavovo-backend.vercel.app/';

async function buscarCatalogo() {
  const resposta = await fetch(`${API_URL}/teste`);
  const dados = await resposta.json();
  console.log(dados);
}
