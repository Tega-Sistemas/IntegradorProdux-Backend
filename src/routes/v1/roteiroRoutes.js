import express from "express";
import {
    listarRoteiros,
    criarRoteiro,
    buscarRoteiroPorId,
    atualizarRoteiro,
    deletarRoteiro,
} from "../../controllers/roteiroController.js";

const router = express.Router();

router.get("/", listarRoteiros);
router.post("/", criarRoteiro);
router.get("/:id", buscarRoteiroPorId);
router.put("/:id", atualizarRoteiro);
router.delete("/:id", deletarRoteiro);

export default router;
