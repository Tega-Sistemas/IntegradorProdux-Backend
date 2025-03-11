import MotivoParada from '../models/MotivoParada.js';

// Listar todos os motivos de parada
export const listarMotivosParada = async (req, res) => {
    try {
        const motivosParada = await MotivoParada.query();
        res.status(200).json(motivosParada);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar motivos de parada', error });
    }
};

// Criar um novo motivo de parada
export const criarMotivoParada = async (req, res) => {
    const { MotivoParadaDescricao, MotivoParadaEvitavel, MotivoParadaInterrupcaoPrevista } = req.body;
    try {
        const novoMotivoParada = await MotivoParada.query().insert({
            MotivoParadaDescricao,
            MotivoParadaEvitavel,
            MotivoParadaInterrupcaoPrevista,
        });
        res.status(201).json(novoMotivoParada);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar motivo de parada', error });
    }
};

// Buscar um motivo de parada pelo ID
export const buscarMotivoParadaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const motivoParada = await MotivoParada.query().findById(id);
        if (motivoParada) {
            res.status(200).json(motivoParada);
        } else {
            res.status(404).json({ message: 'Motivo de parada não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motivo de parada', error });
    }
};

// Atualizar um motivo de parada
export const atualizarMotivoParada = async (req, res) => {
    const { id } = req.params;
    const { MotivoParadaDescricao, MotivoParadaEvitavel } = req.body;
    try {
        const motivoParadaAtualizado = await MotivoParada.query()
            .patchAndFetchById(id, {
                MotivoParadaDescricao,
                MotivoParadaEvitavel,
            });
        if (motivoParadaAtualizado) {
            res.status(200).json(motivoParadaAtualizado);
        } else {
            res.status(404).json({ message: 'Motivo de parada não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar motivo de parada', error });
    }
};

// Deletar um motivo de parada
export const deletarMotivoParada = async (req, res) => {
    const { id } = req.params;
    try {
        const deletado = await MotivoParada.query().deleteById(id);
        if (deletado) {
            res.status(200).json({ message: 'Motivo de parada deletado com sucesso' });
        } else {
            res.status(404).json({ message: 'Motivo de parada não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar motivo de parada', error });
    }
};
