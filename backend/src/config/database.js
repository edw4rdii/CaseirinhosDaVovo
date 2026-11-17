import { MongoClient } from 'mongodb';

// Na Vercel cada requisição pode reaproveitar a mesma instância da função,
// então guardamos a conexão para não abrir uma nova a cada chamada.
let clientPromise = null;

export default async function conectarAoBanco(stringConexao = process.env.STRING_CONEXAO) {
    if (!stringConexao) {
        throw new Error('STRING_CONEXAO não definida nas variáveis de ambiente.');
    }

    if (!clientPromise) {
        console.log('Conectando ao cluster do banco de dados...');
        clientPromise = new MongoClient(stringConexao, { serverSelectionTimeoutMS: 8000 })
            .connect()
            .then((client) => {
                console.log('Conectado ao MongoDB Atlas com sucesso!');
                return client;
            })
            .catch((erro) => {
                // Não usamos process.exit(): na Vercel isso derruba a função
                // sem mostrar o erro. Limpamos o cache para tentar de novo depois.
                clientPromise = null;
                console.error('Falha na conexão com o banco!', erro);
                throw erro;
            });
    }

    return clientPromise;
}
