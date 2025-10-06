import { Router } from "express";
import { FuncionarioController } from "../Controller/FuncionarioController";

const router = Router();
const controller = new FuncionarioController();

/**
 * @swagger
 * tags:
 *   - name: Funcionarios
 *     description: Endpoints para gerenciar funcionários
 */

/**
 * @swagger
 * /funcionarios:
 *   get:
 *      summary: Retorna uma lista de todos os funcionarios
 *      tags: [Funcionarios]
 *      responses:
 *        200:
 *         description: Lista de funcionarios
 *        500:
 *         description: Erro no servidor
 */
router.get("/funcionarios", controller.listar.bind(controller));

/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     summary: Retorna um funcionario pelo ID
 *     tags: [Funcionarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do funcionario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: funcionario encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: funcionario não encontrado
 */
router.get("/funcionarios/:id", controller.buscar.bind(controller));

/**
 * @swagger
 * /funcionarios:
 *   post:
 *     summary: Cria um novo funcionario
 *     tags: [Funcionarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              nome:
 *                type: string
 *              telefone:
 *                type: number
 *              email:
 *                type: string
 *              especialidade:
 *                type: string
 *              servicos:
 *                type: array
 *     responses:
 *       201:
 *        description: Funcionario criado com sucesso
 *       400:
 *        description: Dados inválidos
 *       409:
 *        description: Erro ao criar funcionario
 */
router.post("/funcionarios", controller.criar.bind(controller));

/**
 * @swagger
 * /funcionarios/{id}:
 *   put:
 *     summary: Atualiza um funcionario existente
 *     tags: [Funcionarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do funcionario
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              nome:
 *                type: string
 *              telefone:
 *                type: number
 *              email:
 *                type: string
 *              especialidade:
 *                type: string
 *              servicos:
 *                type: array
 *           responses:
 *              200:
 *                description: Funcionario atualizado com sucesso
 *              400:
 *                description: Dados inválidos
 *              404:
 *                description: Funcionario não encontrado
 */
router.put("/funcionarios/:id", controller.atualizar.bind(controller));

/**
 * @swagger
 * /funcionarios/{id}:
 *   delete:
 *     summary: Deleta um funcionario pelo ID
 *     tags: [Funcionarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do funcionario
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *        description: Funcionario deletado com sucesso
 *       400:
 *        description: ID inválido
 *       404:
 *        description: Funcionario não encontrado
 */
router.delete("/funcionarios/:id", controller.deletar.bind(controller));

export default router;
