import express from 'express';
import {
  criarConsulta,
  listarConsultas,
  updateConsulta,
  toggleActive
} from '../../controllers/consultaController.js';

const router = express.Router();

router.get('/', listarConsultas);
router.post('/', criarConsulta);
router.put('/:id', updateConsulta);
router.patch('/:id/status', toggleActive)

export default router;