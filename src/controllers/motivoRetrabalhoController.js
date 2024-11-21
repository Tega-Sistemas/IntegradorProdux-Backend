import MotivoRetrabalho from "../models/MotivoRetrabalho.js";

// Listar todos os motivos de retrabalho
export const listarMotivosRetrabalho = async (req, res) => {
    try {
        const motivos = await MotivoRetrabalho.query();
        res.status(200).json(motivos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar os motivos de retrabalho." });
    }
};

// Criar um novo motivo de retrabalho
export const criarMotivoRetrabalho = async (req, res) => {
    const { MotivoRetrabalhoDescricao } = req.body;

    try {
        const novoMotivo = await MotivoRetrabalho.query().insert({
            MotivoRetrabalhoDescricao,
        });
        res.status(201).json(novoMotivo);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar o motivo de retrabalho." });
    }
};

// Buscar um motivo de retrabalho por ID
export const buscarMotivoRetrabalhoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const motivo = await MotivoRetrabalho.query().findById(id);
        if (motivo) {
            res.status(200).json(motivo);
        } else {
            res.status(404).json({ error: "Motivo de retrabalho não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o motivo de retrabalho." });
    }
};

// Atualizar um motivo de retrabalho
export const atualizarMotivoRetrabalho = async (req, res) => {
    const { id } = req.params;
    const { MotivoRetrabalhoDescricao } = req.body;

    try {
        const motivoAtualizado = await MotivoRetrabalho.query()
            .findById(id)
            .patch({ MotivoRetrabalhoDescricao });

        if (motivoAtualizado) {
            res.status(200).json({ message: "Motivo de retrabalho atualizado com sucesso." });
        } else {
            res.status(404).json({ error: "Motivo de retrabalho não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o motivo de retrabalho." });
    }
};

// Deletar um motivo de retrabalho
export const deletarMotivoRetrabalho = async (req, res) => {
    const { id } = req.params;

    try {
        const motivoDeletado = await MotivoRetrabalho.query().deleteById(id);

        if (motivoDeletado) {
            res.status(200).json({ message: "Motivo de retrabalho deletado com sucesso." });
        } else {
            res.status(404).json({ error: "Motivo de retrabalho não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar o motivo de retrabalho." });
    }
};
