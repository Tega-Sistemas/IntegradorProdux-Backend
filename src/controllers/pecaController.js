import Peca from "../models/Peca.js";

// Listar todas as peças
export const listarPecas = async (req, res) => {
    try {
        const pecas = await Peca.query();
        res.status(200).json(pecas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar as peças." });
    }
};

// Criar uma nova peça
export const criarPeca = async (req, res) => {
    try {
        const novaPeca = await Peca.query().insert(req.body);
        res.status(201).json(novaPeca);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar a peça." });
    }
};

// Buscar uma peça por código
export const buscarPecaPorCodigo = async (req, res) => {
    const { codigo } = req.params;

    try {
        const peca = await Peca.query().findById(codigo);
        if (peca) {
            res.status(200).json(peca);
        } else {
            res.status(404).json({ error: "Peça não encontrada." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar a peça." });
    }
};

// Atualizar uma peça
export const atualizarPeca = async (req, res) => {
    const { codigo } = req.params;

    try {
        const pecaAtualizada = await Peca.query().findById(codigo).patch(req.body);

        if (pecaAtualizada) {
            res.status(200).json({ message: "Peça atualizada com sucesso." });
        } else {
            res.status(404).json({ error: "Peça não encontrada." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a peça." });
    }
};

// Deletar uma peça
export const deletarPeca = async (req, res) => {
    const { codigo } = req.params;

    try {
        const pecaDeletada = await Peca.query().deleteById(codigo);

        if (pecaDeletada) {
            res.status(200).json({ message: "Peça deletada com sucesso." });
        } else {
            res.status(404).json({ error: "Peça não encontrada." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar a peça." });
    }
};
