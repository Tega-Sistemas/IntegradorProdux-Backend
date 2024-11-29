import Equipamento from '../models/Equipamento.js';

// Listar todos os equipamentos
export const listarEquipamentos = async (req, res) => {
    try {
        const equipamentos = await Equipamento.query();
        res.status(200).json(equipamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar equipamentos', error });
    }
};

// Criar um novo equipamento
export const criarEquipamento = async (req, res) => {
    const { EquipamentoDescricao, EquipamentoNroFuncionarios, UnidadeSigla, SetorId, EmpresaId } = req.body;
    try {
        const novoEquipamento = await Equipamento.query().insert({
            EquipamentoDescricao,
            EquipamentoNroFuncionarios,
            UnidadeSigla,
            SetorId,
            EmpresaId,
        });
        res.status(201).json(novoEquipamento);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar equipamento', error });
    }
};

// Buscar um equipamento pelo ID
export const buscarEquipamentoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const equipamento = await Equipamento.query().findById(id);
        if (equipamento) {
            res.status(200).json(equipamento);
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar equipamento', error });
    }
};

// Atualizar um equipamento
export const atualizarEquipamento = async (req, res) => {
    const { id } = req.params;
    const { EquipamentoDescricao, EquipamentoNroFuncionarios, UnidadeSigla, SetorId, EmpresaId } = req.body;
    try {
        const equipamentoAtualizado = await Equipamento.query()
            .patchAndFetchById(id, {
                EquipamentoDescricao,
                EquipamentoNroFuncionarios,
                UnidadeSigla,
                SetorId,
                EmpresaId,
            });
        if (equipamentoAtualizado) {
            res.status(200).json(equipamentoAtualizado);
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar equipamento', error });
    }
};

// Deletar um equipamento
export const deletarEquipamento = async (req, res) => {
    const { id } = req.params;
    try {
        const deletado = await Equipamento.query().deleteById(id);
        if (deletado) {
            res.status(200).json({ message: 'Equipamento deletado com sucesso' });
        } else {
            res.status(404).json({ message: 'Equipamento não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar equipamento', error });
    }
};
