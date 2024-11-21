import express from 'express';
import {
  listarSetores,
  criarSetor,
  buscarSetorPorId,
  atualizarSetor,
  deletarSetor,
} from '../../controllers/setorController.js';

const router = express.Router();

// Rotas de setores
router.get('/', listarSetores);
router.post('/', criarSetor);
router.get('/:id', buscarSetorPorId);
router.put('/:id', atualizarSetor);
router.delete('/:id', deletarSetor);

export default router;
