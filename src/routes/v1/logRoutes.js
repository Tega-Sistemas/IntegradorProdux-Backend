import express from 'express';
import { listarLogs, criarLog, buscarLogPorId } from '../../controllers/logController.js';

const router = express.Router();

router.get('/', listarLogs);
router.post('/', criarLog);
router.get('/:id', buscarLogPorId);

export default router;
