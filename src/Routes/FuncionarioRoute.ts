import { Router } from "express";
import { FuncionarioController } from "../Controller/FuncionarioController";

const router = Router();
const controller = new FuncionarioController();

router.get("/funcionarios", controller.listar.bind(controller));
router.get("/funcionarios/:id", controller.buscar.bind(controller));
router.post("/funcionarios", controller.criar.bind(controller));
router.put("/funcionarios/:id", controller.atualizar.bind(controller));
router.delete("/funcionarios/:id", controller.deletar.bind(controller));

export default router;
