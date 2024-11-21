import Roteiro from "../models/Roteiro.js";

// Listar todos os roteiros
export const listarRoteiros = async (req, res) => {
    try {
        const roteiros = await Roteiro.query();
        res.status(200).json(roteiros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar os roteiros." });
    }
};

// Criar um novo roteiro
export const criarRoteiro = async (req, res) => {
    try {
        const novoRoteiro = await Roteiro.query().insert(req.body);
        res.status(201).json(novoRoteiro);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar o roteiro." });
    }
};

// Buscar um roteiro por ID
export const buscarRoteiroPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const roteiro = await Roteiro.query().findById(id);
        if (roteiro) {
            res.status(200).json(roteiro);
        } else {
            res.status(404).json({ error: "Roteiro não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o roteiro." });
    }
};

// Atualizar um roteiro
export const atualizarRoteiro = async (req, res) => {
    const { id } = req.params;

    try {
        const roteiroAtualizado = await Roteiro.query().findById(id).patch(req.body);

        if (roteiroAtualizado) {
            res.status(200).json({ message: "Roteiro atualizado com sucesso." });
        } else {
            res.status(404).json({ error: "Roteiro não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o roteiro." });
    }
};

// Deletar um roteiro
export const deletarRoteiro = async (req, res) => {
    const { id } = req.params;

    try {
        const roteiroDeletado = await Roteiro.query().deleteById(id);

        if (roteiroDeletado) {
            res.status(200).json({ message: "Roteiro deletado com sucesso." });
        } else {
            res.status(404).json({ error: "Roteiro não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar o roteiro." });
    }
};
