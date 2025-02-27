import express from 'express';
import {
  criarConsulta,
  listarConsultas,
  updateConsulta
} from '../../controllers/consultaController.js';

const router = express.Router();

router.get('/', listarConsultas);
router.post('/', criarConsulta);
router.put('/:id', updateConsulta);

export default router;