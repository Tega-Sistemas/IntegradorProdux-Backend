import express from "express";
import {
  listarAgendas,
  criarAgenda,
  atualizarAgenda,
  deletarAgenda,
} from "../../controllers/agendaController.js";

const router = express.Router();

router.get("/", listarAgendas);
router.post("/", criarAgenda);
router.put("/:id", atualizarAgenda);
router.delete("/:id", deletarAgenda);

export default router;
