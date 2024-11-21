import express from 'express';
import {
  listarMotivosParada,
  criarMotivoParada,
  buscarMotivoParadaPorId,
  atualizarMotivoParada,
  deletarMotivoParada,
} from '../../controllers/motivoParadaController.js';

const router = express.Router();

// Rotas de motivo de parada
router.get('/', listarMotivosParada);
router.post('/', criarMotivoParada);
router.get('/:id', buscarMotivoParadaPorId);
router.put('/:id', atualizarMotivoParada);
router.delete('/:id', deletarMotivoParada);

export default router;
