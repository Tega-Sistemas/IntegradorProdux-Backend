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
                OrdemProducaoCodReferencial
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
            MotivoRetrabalhoDescricao,
            MotivoRetrabalhoId,
            OperadorId,
            OperadorNome,
            OrdemProducaoId,
            OrdemProducaoCodReferencial
        });

        res.status(201).json(novoCEPP);
    } catch (error) {
        console.error('Erro ao inserir CEPP:', error);
        res.status(500).json({ error: 'Erro ao inserir CEPP' });
    }
});

export default router;
