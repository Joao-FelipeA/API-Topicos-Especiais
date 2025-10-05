import { Router } from "express";
// 1. Importa o novo controller de serviços
import ServicoController from "../Controller/ServicoController";

const router = Router();

// 2. Rotas para a entidade Servicos, usando o novo controller

// GET /servicos
// Retorna todos os serviços
router.get("/servicos", ServicoController.getAllServicos);

// GET /servicos/:id
// Retorna um serviço pelo ID
router.get("/servicos/:id", ServicoController.getServicoById);

// POST /servicos
// Cria um novo serviço
router.post("/servicos", ServicoController.createServico);

// PUT /servicos/:id
// Atualiza um serviço pelo ID
router.put("/servicos/:id", ServicoController.updateServico);

// DELETE /servicos/:id
// Deleta um serviço pelo ID
router.delete("/servicos/:id", ServicoController.deleteServico);

export default router;