import express from 'express';
import { listarEmpresas, criarEmpresa, buscarEmpresaPorId, atualizarEmpresa, deletarEmpresa } from '../../controllers/empresaController.js';

const router = express.Router();

// Rotas de empresa
router.get('/', listarEmpresas);
router.post('/', criarEmpresa);
router.get('/:id', buscarEmpresaPorId);
router.put('/:id', atualizarEmpresa);
router.delete('/:id', deletarEmpresa);

export default router;
