import express from 'express';
import { listarLogs, buscarLogPorId } from '../../controllers/logController.js';

const router = express.Router();

router.get('/', listarLogs);

router.get('/:id', buscarLogPorId);

export default router;
