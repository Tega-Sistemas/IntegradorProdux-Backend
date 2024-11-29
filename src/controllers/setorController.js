import Setor from '../models/Setor.js';

// Listar todos os setores
export const listarSetores = async (req, res) => {
    try {
        const setores = await Setor.query();
        res.status(200).json(setores);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar setores', error });
    }
};

// Criar um novo setor
export const criarSetor = async (req, res) => {
    const { SetorDescricao, SetorDtInclusao, SetorDescricaoAbreviacao } = req.body;
    try {
        const novoSetor = await Setor.query().insert({
            SetorDescricao,
            SetorDtInclusao,
            SetorDescricaoAbreviacao,
        });
        res.status(201).json(novoSetor);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar setor', error });
    }
};

// Buscar um setor pelo ID
export const buscarSetorPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const setor = await Setor.query().findById(id);
        if (setor) {
            res.status(200).json(setor);
        } else {
            res.status(404).json({ message: 'Setor não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar setor', error });
    }
};

// Atualizar um setor
export const atualizarSetor = async (req, res) => {
    const { id } = req.params;
    const { SetorDescricao, SetorDtInclusao, SetorDescricaoAbreviacao } = req.body;
    try {
        const setorAtualizado = await Setor.query()
            .patchAndFetchById(id, {
                SetorDescricao,
                SetorDtInclusao,
                SetorDescricaoAbreviacao,
            });
        if (setorAtualizado) {
            res.status(200).json(setorAtualizado);
        } else {
            res.status(404).json({ message: 'Setor não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar setor', error });
    }
};

// Deletar um setor
export const deletarSetor = async (req, res) => {
    const { id } = req.params;
    try {
        const deletado = await Setor.query().deleteById(id);
        if (deletado) {
            res.status(200).json({ message: 'Setor deletado com sucesso' });
        } else {
            res.status(404).json({ message: 'Setor não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar setor', error });
    }
};
