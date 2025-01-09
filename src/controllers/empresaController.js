import Empresa from '../models/Empresa.js';

export const listarEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.query();
        res.json(empresas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarEmpresa = async (req, res) => {
    const { EmpresaNome, EmpresaCNPJ, EmpresaNomeInterno, EmpresaNomeFantasia } = req.body;

    try {
        const novaEmpresa = await Empresa.query().insert({
            EmpresaNome,
            EmpresaCNPJ,
            EmpresaNomeInterno,
            EmpresaNomeFantasia,
        });
        res.status(201).json(novaEmpresa);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const buscarEmpresaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const empresa = await Empresa.query().findById(id);
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }
        res.json(empresa);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const atualizarEmpresa = async (req, res) => {
    const { id } = req.params;
    const { EmpresaNome, EmpresaCNPJ, EmpresaNomeInterno, EmpresaNomeFantasia } = req.body;

    try {
        const empresa = await Empresa.query().findById(id);
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        const empresaAtualizada = await Empresa.query()
            .findById(id)
            .patch({
                EmpresaNome,
                EmpresaCNPJ,
                EmpresaNomeInterno,
                EmpresaNomeFantasia,
            });

        res.json(empresaAtualizada);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deletarEmpresa = async (req, res) => {
    const { id } = req.params;

    try {
        const empresa = await Empresa.query().findById(id);

        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        await Empresa.query().deleteById(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
