import { Router } from "express";
import clienteController from "../Controller/ClienteController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Endpoints para gerenciar clientes
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *      summary: Retorna uma lista de todos os clientes
 *      tags: [Clientes]
 *      responses:
 *        200:
 *         description: Lista de clientes
 *        500:
 *         description: Erro no servidor
 */
router.get("/clientes", clienteController.getClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Retorna um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Cliente não encontrado
 */
router.get("/clientes/:id", clienteController.getClientesById);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              nome:
 *                type: string
 *              CPF:
 *                type: string
 *              CNPJ:
 *                type: string
 *              email:
 *                type: string
 *              telefone:
 *                type: number
 *              servicos:
 *                type: array
 *     responses:
 *       201:
 *        description: Cliente criado com sucesso
 *       400:
 *        description: Dados inválidos
 *       409:
 *        description: Cliente já existente
 */
router.post("/clientes", clienteController.createCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
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
 *              CPF:
 *                type: string
 *              CNPJ:
 *                type: string
 *              email:
 *                type: string
 *              telefone:
 *                type: number
 *              servicos:
 *                type: array
 *           responses:
 *              200:
 *                description: Cliente atualizado com sucesso
 *              400:
 *                description: Dados inválidos
 *              500:
 *                description: Erro no servidor
 */
router.put("/clientes/:id", clienteController.updateCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Deleta um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *        description: Cliente deletado com sucesso
 *       400:
 *        description: ID inválido
 *       404:
 *        description: Cliente não encontrado
 */
router.delete("/clientes/:id", clienteController.deleteCliente);

export default router;
