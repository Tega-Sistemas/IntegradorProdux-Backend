import express from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import empresaRoutes from './empresaRoutes.js';
import setorRoutes from './setorRoutes.js';
import equipamentoRoutes from './equipamentoRoutes.js';
import motivoParadaRoutes from './motivoParadaRoutes.js';
import motivoRetrabalhoRoutes from "./motivoRetrabalhoRoutes.js";
import operacoesRoutes from "./operacoesRoutes.js";
import ordemProducaoRoutes from "./ordemProducaoRoutes.js";
import pecaRoutes from "./pecaRoutes.js";
import roteiroRoutes from "./roteiroRoutes.js";
import agendaRoutes from "./agendaRoutes.js";
import configuracaoIntegracaoRoutes from "./configuracaoIntegracaoRoutes.js";
import sincronizacaoRoutes from "./sincronizacaoRoutes.js";
import logRoutes from "./logRoutes.js";

const router = express.Router();

router.use('/usuarios', usuarioRoutes);
router.use('/empresas', empresaRoutes);
router.use('/setores', setorRoutes);
router.use('/equipamentos', equipamentoRoutes);
router.use('/motivosparada', motivoParadaRoutes);
router.use("/motivosretrabalho", motivoRetrabalhoRoutes);
router.use("/operacoes", operacoesRoutes);
router.use("/ordemproducao", ordemProducaoRoutes);
router.use("/pecas", pecaRoutes);
router.use("/roteiros", roteiroRoutes);
router.use("/agenda", agendaRoutes);
router.use("/configuracoesintegracao", configuracaoIntegracaoRoutes);
router.use("/sincronizarforcado", sincronizacaoRoutes);
router.use("/logs", logRoutes);

export default router;
