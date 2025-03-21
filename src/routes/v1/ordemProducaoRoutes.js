import express from "express";
import {
    listarOrdensProducao,
    criarOrdemProducao,
    buscarOrdemProducaoPorId,
    atualizarOrdemProducao,
    deletarOrdemProducao,
    getQtdeProgramada,
    getQtdeOrdensProgramadas
} from "../../controllers/ordemProducaoController.js";

const router = express.Router();

router.get("/", listarOrdensProducao);
router.post("/", criarOrdemProducao);
router.get("/qtdeprogramada", getQtdeProgramada);
router.get("/qtdeordensprogramadas", getQtdeOrdensProgramadas);
router.get("/:id", buscarOrdemProducaoPorId);
router.put("/:id", atualizarOrdemProducao);
router.delete("/:id", deletarOrdemProducao);

export default router;
