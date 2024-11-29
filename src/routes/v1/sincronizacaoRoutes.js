// src/routes/v1/sincronizacaoRoutes.js
import express from 'express';
import { realizarSincronizacao } from '../../services/sincronizacaoService.js';

const router = express.Router();

// Rota para forçar a sincronização
router.post('/', async (req, res) => {
  try {
    const resultado = await realizarSincronizacao();
    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao forçar sincronização:', error);
    return res.status(500).json({ message: 'Erro ao forçar sincronização', error: error.message });
  }
});

export default router;
