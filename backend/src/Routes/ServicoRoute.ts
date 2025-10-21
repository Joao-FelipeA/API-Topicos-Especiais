import { Router } from "express";
import * as ServicoController from "../Controller/ServicoController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Servicos
 *     description: Endpoints para gerenciar os servicos
 */

/**
 * @swagger
 * /servicos:
 *   get:
 *      summary: Retorna uma lista de todos os servicos
 *      tags: [Servicos]
 *      responses:
 *        200:
 *         description: Lista de servicos
 *        500:
 *         description: Erro no servidor
 */
router.get("/servicos", ServicoController.getAllServicos);

// router.get("/servicos/opcoes", ServicoController.getOpcoesParaServico); SEM USO

/**
 * @swagger
 * /servicos/{id}:
 *   get:
 *     summary: Retorna um servico pelo ID
 *     tags: [Servicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do servico
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servico encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Servico não encontrado
 */
router.get("/servicos/:id", ServicoController.getServicoById);

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Cria um novo servico
 *     tags: [Servicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *              valor_total:
 *                type: number
 *              clienteID:
 *                type: integer
 *              funcionarioID:
 *                type: integer
 *     responses:
 *       201:
 *        description: Servico criado com sucesso
 *       400:
 *        description: Dados inválidos
 *       404:
 *        description: Servico não encontrado
 *       500:
 *        description: Erro no servidor
 */
router.post("/servicos", ServicoController.createServico);

/**
 * @swagger
 * /servicos/{id}:
 *    put:
 *     summary: Atualiza um servico existente
 *     tags: [Servicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do servico
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *              valor_total:
 *                type: number
 *              clienteID:
 *                type: integer
 *              funcionarioID:
 *                type: integer
 *            responses:
 *              200:
 *                description: Servico atualizado com sucesso
 *              400:
 *                description: Dados inválidos
 *              404:
 *                description: Servico não encontrado
 *              500:
 *                description: Erro no servidor
 */
router.put("/servicos/:id", ServicoController.updateServico);

/**
 * @swagger
 * /servicos/{id}:
 *   delete:
 *     summary: Deleta um servico pelo ID
 *     tags: [Servicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do servico
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *        description: Servico deletado com sucesso
 *       400:
 *        description: ID inválido
 *       404:
 *        description: Servico não encontrado
 *       500:
 *        description: Erro no servidor
 */
router.delete("/servicos/:id", ServicoController.deleteServico);

export default router;
