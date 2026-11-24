import conectarAoBanco from '../config/database.js';

// Usa o banco informado na STRING_CONEXAO (ex.: ...mongodb.net/caseirinhos)
// ou DB_NAME, se definido.
export async function getBanco() {
    const cliente = await conectarAoBanco();
    return cliente.db(process.env.DB_NAME);
}

export async function testarConexao() {
    const banco = await getBanco();
    await banco.command({ ping: 1 });
    const colecoes = await banco.listCollections({}, { nameOnly: true }).toArray();
    return { banco: banco.databaseName, colecoes: colecoes.map((c) => c.name) };
}
