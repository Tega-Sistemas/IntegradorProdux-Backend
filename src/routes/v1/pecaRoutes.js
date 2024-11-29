import express from "express";
import {
    listarPecas,
    criarPeca,
    buscarPecaPorCodigo,
    atualizarPeca,
    deletarPeca,
} from "../../controllers/pecaController.js";

const router = express.Router();

router.get("/", listarPecas);
router.post("/", criarPeca);
router.get("/:codigo", buscarPecaPorCodigo);
router.put("/:codigo", atualizarPeca);
router.delete("/:codigo", deletarPeca);

export default router;
