import { Router } from "express";
import * as ServicoController from "../Controller/ServicoController";
import authenticateToken from "../middleware/auth";

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 *             example:
 *               - id: 1
 *                 status: "aberto"
 *                 valor_total: 150.5
 *                 clienteID: 1
 *                 funcionarioID: 2
 *               - id: 2
 *                 status: "concluido"
 *                 valor_total: 300
 *                 clienteID: 2
 *                 funcionarioID: 1
 *        500:
 *         description: Erro no servidor
 */
router.get("/servicos", authenticateToken, ServicoController.getAllServicos);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *             example:
 *               id: 1
 *               status: "aberto"
 *               valor_total: 150.5
 *               clienteID: 1
 *               funcionarioID: 2
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Servico não encontrado
 */
router.get(
  "/servicos/:id",
  authenticateToken,
  ServicoController.getServicoById
);

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
 *              dta_conclusao:
 *                type: string
 *                format: date-time
 *     responses:
 *       201:
 *        description: Servico criado com sucesso
 *       400:
 *        description: Dados inválidos
 *       500:
 *        description: Erro no servidor
 */
router.post("/servicos", authenticateToken, ServicoController.createServico);

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
 *              dta_conclusao:
 *                type: string
 *                format: date-time
 *     responses:
 *       200:
 *         description: Servico atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Servico não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put("/servicos/:id", authenticateToken, ServicoController.updateServico);

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
router.delete(
  "/servicos/:id",
  authenticateToken,
  ServicoController.deleteServico
);

export default router;
