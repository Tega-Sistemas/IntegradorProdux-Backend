import express from "express";
import {
  listarOperacoes,
  criarOperacao,
  buscarOperacaoPorId,
  atualizarOperacao,
  deletarOperacao,
} from "../../controllers/operacoesController.js";

const router = express.Router();

router.get("/", listarOperacoes);
router.post("/", criarOperacao);
router.get("/:id", buscarOperacaoPorId);
router.put("/:id", atualizarOperacao);
router.delete("/:id", deletarOperacao);

export default router;
