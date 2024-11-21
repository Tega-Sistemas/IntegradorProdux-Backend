import express from "express";
import {
    listarMotivosRetrabalho,
    criarMotivoRetrabalho,
    buscarMotivoRetrabalhoPorId,
    atualizarMotivoRetrabalho,
    deletarMotivoRetrabalho,
} from "../../controllers/motivoRetrabalhoController.js";

const router = express.Router();

router.get("/", listarMotivosRetrabalho);
router.post("/", criarMotivoRetrabalho);
router.get("/:id", buscarMotivoRetrabalhoPorId);
router.put("/:id", atualizarMotivoRetrabalho);
router.delete("/:id", deletarMotivoRetrabalho);

export default router;
