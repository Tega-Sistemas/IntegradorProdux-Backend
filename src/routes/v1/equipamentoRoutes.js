import express from 'express';
import {
  listarEquipamentos,
  criarEquipamento,
  buscarEquipamentoPorId,
  atualizarEquipamento,
  deletarEquipamento,
} from '../../controllers/equipamentoController.js';

const router = express.Router();

// Rotas de equipamentos
router.get('/', listarEquipamentos);
router.post('/', criarEquipamento);
router.get('/:id', buscarEquipamentoPorId);
router.put('/:id', atualizarEquipamento);
router.delete('/:id', deletarEquipamento);

export default router;
