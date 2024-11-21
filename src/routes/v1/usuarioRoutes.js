import express from 'express';
import { listarUsuarios, criarUsuario, buscarUsuarioPorId, atualizarUsuario, deletarUsuario } from '../../controllers/usuarioController.js';

const router = express.Router();

// Rotas de usuários
router.get('/', listarUsuarios);
router.post('/', criarUsuario);
router.get('/:id', buscarUsuarioPorId);
router.put('/:id', atualizarUsuario);
router.delete('/:id', deletarUsuario);

export default router;
