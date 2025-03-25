import { v4 as uuidv4, v4 } from 'uuid';
import Log from '../models/Log.js';

export const listarLogs = async (req, res) => {
    console.log('Chamada')
    const { dataInicial, dataFinal, ordenacao, page, limit } = req.query;

    const offset = (page - 1) * limit;

    if (!dataInicial || !dataFinal) {
        return res.status(400).json({ message: 'As datas inicial e final são obrigatórias' });
    }

    if (ordenacao) {
        const ordemValida = ordenacao.toLowerCase() === 'asc' || ordenacao.toLowerCase() === 'desc';
        if (ordenacao && !ordemValida) {
            return res.status(400).json({ message: 'O parâmetro "ordenacao" deve ser "asc" (crescente) ou "desc" (decrescente)' });
        }
    }

    const ordem = ordenacao || 'desc';

    try {
        const totalResult = await Log.query()
            .whereBetween('created_at', [dataInicial, dataFinal])
            .count('* as total')
            .first();

        const total = parseInt(totalResult.total);
        const logs = await Log.query()
            .whereBetween('created_at', [dataInicial, dataFinal])
            .orderBy('created_at', ordem)
            .limit(limit)
            .offset(offset);

        res.status(200).json({ logs, total });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar logs', error });
    }
};

export const criarLog = async (req, res) => {

    const { level, message } = req.body;

    try {
        if (["SUCCESS", "INFO", "ERROR"].includes(level)) {
            let uuid = uuidv4();

            await Log.query().insert({
                id: uuid,
                level,
                message
            });

            res.status(200).json(Log);
        } else {
            res.status(400).json({ message: 'Level de log inválido (SUCCESS, INFO, ERROR)' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar log', error });
    }
};

export const buscarLogPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const log = await Log.query().findById(id);

        if (log) {
            res.status(200).json(log);
        } else {
            res.status(404).json({ message: 'Log não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar log', error });
    }
};
