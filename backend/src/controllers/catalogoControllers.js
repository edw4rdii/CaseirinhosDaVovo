import { testarConexao } from "../models/catalogoModels.js";

export const controllerGet = async (req, res) => {
    res.status(200).json({ mensagem: "Rota /teste funcionando!" });
}

export const controllerTesteBanco = async (req, res) => {
    try {
        const resultado = await testarConexao();
        res.status(200).json({ conectado: true, ...resultado });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ conectado: false, erro: erro.message });
    }
}
