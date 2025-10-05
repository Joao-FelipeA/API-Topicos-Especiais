import { Router } from "express";
import { FuncionarioController } from "../Controller/FuncionarioController";

const router = Router();
const controller = new FuncionarioController();

router.get("/", controller.listar.bind(controller));
router.get("/:id", controller.buscar.bind(controller));
router.post("/", controller.criar.bind(controller));
router.put("/:id", controller.atualizar.bind(controller));
router.delete("/:id", controller.deletar.bind(controller));

export default router;
