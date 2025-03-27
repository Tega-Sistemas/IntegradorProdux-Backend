import dayjs from "dayjs";
import OrdemProducao from "../models/OrdemProducao.js";

// Listar todas as ordens de produção
export const listarOrdensProducao = async (req, res) => {
    try {
        const ordens = await OrdemProducao.query();
        res.status(200).json(ordens);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar as ordens de produção." });
    }
};

// Criar uma nova ordem de produção
export const criarOrdemProducao = async (req, res) => {
    try {
        const novaOrdem = await OrdemProducao.query().insert(req.body);
        res.status(201).json(novaOrdem);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar a ordem de produção." });
    }
};

// Buscar uma ordem de produção por ID
export const buscarOrdemProducaoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const ordem = await OrdemProducao.query().findById(id);
        if (ordem) {
            res.status(200).json(ordem);
        } else {
            res.status(404).json({ error: "Ordem de produção não encontrada." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar a ordem de produção." });
    }
};

// Atualizar uma ordem de produção
export const atualizarOrdemProducao = async (req, res) => {
    const { id } = req.params;

    try {
        const ordemAtualizada = await OrdemProducao.query()
            .findById(id)
            .patch(req.body);

        if (ordemAtualizada) {
            res.status(200).json({ message: "Ordem de produção atualizada com sucesso." });
        } else {
            res.status(404).json({ error: "Ordem de produção não encontrada." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a ordem de produção." });
    }
};

// Deletar uma ordem de produção
export const deletarOrdemProducao = async (req, res) => {
    const { id } = req.params;

    try {
        const ordemDeletada = await OrdemProducao.query().deleteById(id);

        if (ordemDeletada) {
            res.status(200).json({ message: "Ordem de produção deletada com sucesso." });
        } else {
            res.status(404).json({ error: "Ordem de produção não encontrada." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar a ordem de produção." });
    }
};

export const getQtdeProgramada = async (req, res) => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    try {
        const qtdeProgramada = await OrdemProducao.query()
            .select(OrdemProducao.raw("SUM(OrdemProducaoQtdeProgramada) AS total"))
            .where("OrdemProducaoDtProgramado", currentDate)
            .first();

        const total = qtdeProgramada.total ? Number(qtdeProgramada.total) : 0;
        res.status(200).json({ qtdeProgramda: total });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar a quantidade programada." });
    }
};

export const getQtdeOrdensProgramadas = async (req, res) => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    try {
        const totalOrdensProgramadas = await OrdemProducao.query()
            .count("* as total")
            .where("OrdemProducaoDtProgramado", currentDate)
            .first();
        const total = totalOrdensProgramadas ? Number(totalOrdensProgramadas.total) : 0;
        res.status(200).json({ qtdeOrdensProgramadas: total });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar a quantidade programada." });
    }
}