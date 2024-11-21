import express from 'express';
import { 
  criarConfiguracaoIntegracao, 
  listarConfiguracoesIntegracao, 
  obterConfiguracaoPorId, 
  atualizarConfiguracaoIntegracao, 
  excluirConfiguracaoIntegracao 
} from '../../controllers/configuracaoIntegracaoController.js';

const router = express.Router();

router.post('/', criarConfiguracaoIntegracao);

router.get('/', listarConfiguracoesIntegracao);

router.get('/:id', obterConfiguracaoPorId);

router.put('/:id', atualizarConfiguracaoIntegracao);

router.delete('/:id', excluirConfiguracaoIntegracao);

export default router;
