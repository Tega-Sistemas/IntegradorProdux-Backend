import express from 'express';
import CEPP from '../models/Cepp.js';
import { formToJSON } from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const ceppList = await CEPP.query().select();
        res.status(200).json(ceppList);
    } catch (error) {
        console.error('Erro ao listar CEPPs:', error);
        res.status(500).json({ error: 'Erro ao listar CEPPs' });
    }
});

router.get('/sincronizarerp', async (req, res) => {
    try {
        const ceppList = await CEPP.query()
            .select()
            .where(
                'CEPPSincronizado', 0
            );
        res.status(200).json(ceppList);
    } catch (error) {
        console.error('Erro ao listar CEPPs:', error);
        res.status(500).json({ error: 'Erro ao listar CEPPs' });
    }
});

router.post('/', async (req, res) => {
    try {

        const {
            sdtCEPP: {
                EmpresaId,
                CEPPTipoCEPP,
                MotivoRetrabalhoId,
                MotivoRetrabalhoDescricao,
                MotivoParadaId,
                MotivoParadaDescricao,
                MotivoParadaTpErpExterno,
                CEPPDtCadastro,
                OrdemProducaoId,
                EquipamentoId,
                CEPPDtInicio,
                CEPPDtTermino,
                CEPPDtInicioRelatorio,
                CEPPMinutoCentesimal,
                CEPPQtdeProduzida,
                CEPPQtdePerda,
                CEPPQtdeSobra,
                OperadorId,
                OperadorNome,
                CEPPProduxId,
                OrdemProducaoCodReferencial,
                OperacoesCEPPId,
                OperacoesCEPPDescricao,
                stSetorId,
                stSetorDescricao
            }
        } = req.body;

        const novoCEPP = await CEPP.query().insert({
            CEPPDtCadastro,
            CEPPDtInicio,
            CEPPDtInicioRelatorio,
            CEPPDtTermino,
            CEPPMinutoCentesimal,
            CEPPProduxId,
            CEPPQtdePerda,
            CEPPQtdeProduzida,
            CEPPQtdeSobra,
            CEPPTipoCEPP,
            EmpresaId,
            EquipamentoId,
            MotivoParadaDescricao,
            MotivoParadaId,
            MotivoParadaTpErpExterno,
            MotivoRetrabalhoDescricao,
            MotivoRetrabalhoId,
            OperadorId,
            OperadorNome,
            OrdemProducaoId,
            OrdemProducaoCodReferencial,
            OperacoesCEPPId,
            OperacoesCEPPDescricao,
            stSetorId,
            stSetorDescricao
        });

        res.status(201).json({
            isError: false,
            message: 'CEPP inserido com sucesso',
            CEPPErdId: novoCEPP.CEPPId
        });
    } catch (error) {
        res.status(400).json({
            isError: true,
            message: 'Erro ao inserir CEPP:' + error,
            CEPPErdId: 0
        });
        // res.status(500).json({ error: 'Erro ao inserir CEPP' });
    }
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: 'ID não informado' });
    }

    try {
        const cepp = await CEPP.query().findById(id);

        if (!cepp) {
            return res.status(404).json({ error: 'CEPP não encontrado' });
        }

        await CEPP.query()
            .patchAndFetchById(id, req.body);


        return res.status(200).json({ message: 'CEPP atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar CEPP:', error);
        return res.status(500).json({ error: 'Erro ao atualizar CEPP' });
    }
});


export default router;
