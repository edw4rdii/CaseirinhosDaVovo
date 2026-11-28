import { requisitar, ErroApi } from './api.js';

export const CHAVE_ULTIMO_PEDIDO = 'caseirinhos:ultimoPedido';

export const ROTULOS_STATUS = Object.freeze({
  pendente: 'Pendente de aprovação',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
});

// DEPENDE DO BACKEND (rota ainda não implementada: routes/index.js tem "/pedidos" comentado).
// Contrato proposto:
//   POST {apiBase}/pedidos  (multipart/form-data)
//   campos: tipo="encomenda", tamanhoKg, sabor, recheio, tema, mensagem, descricao, restricoes,
//           data (AAAA-MM-DD), horario (HH:MM), recebimento ("retirada" | "entrega"),
//           clienteNome, clienteTelefone (só dígitos), foto (arquivo opcional)
//   resposta de sucesso: 201 { numero, status }  — status inicial "pendente"
// O número do pedido vem sempre do backend; a tela de sucesso só abre se ele vier na resposta.
export async function criarEncomenda(dados) {
  const corpo = new FormData();
  corpo.append('tipo', 'encomenda');
  corpo.append('tamanhoKg', dados.tamanho);
  corpo.append('sabor', dados.sabor);
  corpo.append('recheio', dados.recheio);
  corpo.append('data', dados.data);
  corpo.append('horario', dados.horario);
  corpo.append('recebimento', dados.recebimento);
  corpo.append('clienteNome', dados.nome);
  corpo.append('clienteTelefone', dados.whatsapp.replace(/\D/g, ''));
  ['tema', 'mensagem', 'descricao', 'restricoes'].forEach((campo) => {
    if (dados[campo]) corpo.append(campo, dados[campo]);
  });
  if (dados.foto) corpo.append('foto', dados.foto);

  const resposta = await requisitar('/pedidos', { metodo: 'POST', corpo });
  if (resposta?.numero === undefined || resposta?.numero === null) {
    throw new ErroApi('O servidor não confirmou o registro do pedido.');
  }
  return { numero: resposta.numero, status: resposta.status ?? 'pendente' };
}
