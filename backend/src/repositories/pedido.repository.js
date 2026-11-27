import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/database.js";

async function banco() {
  const cliente = await conectarAoBanco();
  return cliente.db(process.env.DB_NAME);
}

async function colecao() {
  return (await banco()).collection("pedidos");
}

export async function listar(filtro) {
  return (await colecao()).find(filtro).sort({ dataEntrega: 1 }).toArray();
}

/** @param {string} id */
export async function buscarPorId(id) {
  return (await colecao()).findOne({ _id: new ObjectId(id) });
}

export async function inserir(pedido) {
  const resultado = await (await colecao()).insertOne(pedido);
  return { _id: resultado.insertedId, ...pedido };
}

/** @param {string} id */
export async function atualizar(id, dados) {
  return (await colecao()).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: dados },
    { returnDocument: "after" }
  );
}

// Contador atômico: dois pedidos simultâneos nunca recebem o mesmo código.
export async function proximoNumero() {
  const contador = await (await banco()).collection("contadores").findOneAndUpdate(
    { _id: "pedidos" },
    { $inc: { valor: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  return contador.valor;
}
