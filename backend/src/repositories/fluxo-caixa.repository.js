import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/database.js";

// ÚNICO arquivo que fala com a collection "lancamentos".
// Só faz consulta/gravação — nenhuma regra de negócio aqui.
async function colecao() {
  const cliente = await conectarAoBanco();
  return cliente.db(process.env.DB_NAME).collection("lancamentos");
}

export async function listar(filtro) {
  return (await colecao()).find(filtro).sort({ data: -1 }).toArray();
}

/** @param {string} id */
export async function buscarPorId(id) {
  return (await colecao()).findOne({ _id: new ObjectId(id) });
}

export async function inserir(lancamento) {
  const resultado = await (await colecao()).insertOne(lancamento);
  return { _id: resultado.insertedId, ...lancamento };
}

/** @param {string} id */
export async function atualizar(id, dados) {
  // retorna o documento já atualizado (ou null se o id não existir)
  return (await colecao()).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: dados },
    { returnDocument: "after" }
  );
}

/** @param {string} id */
export async function remover(id) {
  const resultado = await (await colecao()).deleteOne({ _id: new ObjectId(id) });
  return resultado.deletedCount > 0;
}

// Soma entradas e saídas no próprio banco (mais eficiente que somar no JS).
export async function somarPorTipo(filtro) {
  return (await colecao())
    .aggregate([
      { $match: filtro },
      { $group: { _id: "$tipo", total: { $sum: "$valor" } } },
    ])
    .toArray();
}
