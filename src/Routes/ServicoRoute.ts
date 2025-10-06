import { Router } from "express";
import * as ServicoController from "../Controller/ServicoController";

const router = Router();

router.get("/servicos", ServicoController.getAllServicos);
router.get("/servicos/opcoes", ServicoController.getOpcoesParaServico);
router.get("/servicos/:id", ServicoController.getServicoById);
router.post("/servicos", ServicoController.createServico);
router.put("/servicos/:id", ServicoController.updateServico);
router.delete("/servicos/:id", ServicoController.deleteServico);

export default router;