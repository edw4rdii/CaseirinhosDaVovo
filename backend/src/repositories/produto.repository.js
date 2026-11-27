import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/database.js";

async function colecao() {
  const cliente = await conectarAoBanco();
  return cliente.db(process.env.DB_NAME).collection("produtos");
}

/** @param {string[]} ids */
export async function buscarPorIds(ids) {
  return (await colecao()).find({ _id: { $in: ids.map((id) => new ObjectId(id)) } }).toArray();
}
