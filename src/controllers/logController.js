import Log from '../models/Log.js';

export const listarLogs = async (req, res) => {
    const { dataInicial, dataFinal, ordenacao } = req.query;

    if (!dataInicial || !dataFinal) {
        return res.status(400).json({ message: 'As datas inicial e final são obrigatórias' });
    }

    const ordemValida = ordenacao === 'asc' || ordenacao === 'desc';
    if (ordenacao && !ordemValida) {
        return res.status(400).json({ message: 'O parâmetro "ordenacao" deve ser "asc" (crescente) ou "desc" (decrescente)' });
    }

    const ordem = ordenacao || 'desc';

    try {
        const logs = await Log.query()
            .whereBetween('created_at', [dataInicial, dataFinal])
            .orderBy('created_at', ordem);

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar logs', error });
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
