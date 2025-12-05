import { Router } from "express";
import funcionarioController from "../Controller/FuncionarioController";

const router = Router();

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
 *     summary: Retorna uma lista de todos os funcionários com seus serviços
 *     tags: [Funcionarios]
 *     responses:
 *       200:
 *         description: Lista de funcionários com IDs dos serviços associados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcionario'
 *             example:
 *               - id: 1
 *                 nome: "Maria Santos"
 *                 telefone: 11999999999
 *                 email: "maria@email.com"
 *                 especialidade: "Desenvolvedor"
 *                 servicos: [{"id": 1}, {"id": 3}]
 *               - id: 2
 *                 nome: "João Silva"
 *                 telefone: 11888888888
 *                 email: "joao@email.com"
 *                 especialidade: "Designer"
 *                 servicos: [{"id": 2}]
 *       500:
 *         description: Erro no servidor
 */
router.get(
  "/funcionarios",
  funcionarioController.listar.bind(funcionarioController)
);

/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     summary: Retorna um funcionário pelo ID com seus serviços
 *     tags: [Funcionarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do funcionário
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Funcionário encontrado com IDs dos serviços associados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *             example:
 *               id: 1
 *               nome: "Maria Santos"
 *               telefone: 11999999999
 *               email: "maria@email.com"
 *               especialidade: "Desenvolvedor"
 *               servicos: [{"id": 1}, {"id": 3}, {"id": 5}]
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Funcionário não encontrado
 */
router.get(
  "/funcionarios/:id",
  funcionarioController.buscar.bind(funcionarioController)
);

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
 *              CPF:
 *                type: string
 *              senha:
 *                type: string
 *     responses:
 *       201:
 *        description: Funcionario criado com sucesso
 *       400:
 *        description: Dados inválidos
 *       409:
 *        description: Erro ao criar funcionario
 */
router.post(
  "/funcionarios",
  funcionarioController.criar.bind(funcionarioController)
);

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
 *              CPF:
 *                type: string
 *              senha:
 *                type: string
 *     responses:
 *       200:
 *         description: Funcionario atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Funcionario não encontrado
 */
router.put(
  "/funcionarios/:id",
  funcionarioController.atualizar.bind(funcionarioController)
);

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
router.delete(
  "/funcionarios/:id",
  funcionarioController.deletar.bind(funcionarioController)
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login de um funcionário
 *     tags: [Funcionarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: funcionario@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso. Retorna token e dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/Funcionario'
 *             example:
 *               message: "Login realizado com sucesso"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: 1
 *                 nome: "Maria Santos"
 *                 email: "maria@email.com"
 *                 telefone: 11999999999
 *                 especialidade: "Desenvolvedor"
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
router.post(
  "/login",
  funcionarioController.buscarPorLogin.bind(funcionarioController)
);

export default router;
