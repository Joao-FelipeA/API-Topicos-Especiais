import { Request, Response } from "express";
import { Funcionario } from "../generated/prisma";
import { FuncionarioService } from "../Service/FuncionarioService";
import {
  createFuncionarioSchema,
  updateFuncionarioSchema,
} from "../Schemas/validation";
import prisma from "../database/prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";

const service = new FuncionarioService();

const funcionarioController = {
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const funcionarios = await prisma.funcionario.findMany({
        include: {
          servicos: {
            select: {
              id: true,
            },
          },
        },
      });
      const sanitized = funcionarios.map((f: Funcionario) => {
        const { senha, ...rest } = f as any;
        return rest;
      });
      res.status(200).json(sanitized);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar funcionários." });
    }
  },

  async buscar(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res
        .status(400)
        .json({ message: "ID inválido. Deve ser um número inteiro positivo" });
      return;
    }

    try {
      const funcionario = await prisma.funcionario.findUnique({
        where: { id },
        include: {
          servicos: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!funcionario) {
        res.status(404).json({ message: "Funcionário não encontrado" });
        return;
      }
      const { senha, ...rest } = funcionario as any;
      res.json(rest);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar funcionário." });
    }
  },
  async criar(req: Request, res: Response) {
    try {
      const validatedData = createFuncionarioSchema.parse(req.body);
      const funcionario: Funcionario = await service.criar(validatedData);
      const { senha, ...funcSemSenha } = funcionario as any;
      res.status(201).json(funcSemSenha);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Dados inválidos",
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }

      res.status(409).json({ message: "Erro ao criar funcionário" });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          message: "ID inválido. Deve ser um número inteiro positivo",
        });
        return;
      }

      const validatedData = updateFuncionarioSchema.parse(req.body);

      if (Object.keys(validatedData).length === 0) {
        res
          .status(400)
          .json({ message: "Nenhum dado para atualizar foi fornecido." });
        return;
      }

      const funcionarioAtualizado = await service.atualizar(id, validatedData);
      res.json(funcionarioAtualizado);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Dados inválidos",
          errors: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }

      res.status(404).json({ message: "Funcionário não encontrado." });
    }
  },

  async deletar(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ message: "ID inválido. Deve ser um número inteiro positivo" });
    }

    try {
      await service.deletar(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "Funcionário não encontrado." });
    }
  },

  async buscarPorLogin(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res
          .status(400)
          .json({ message: "Email e senha são obrigatórios." });
      }
      const funcionario = await service.buscarPorLogin(email, senha);
      if (!funcionario) {
        return res.status(404).json({ message: "Funcionário não encontrado." });
      }

      // Gerar token JWT
      const JWT_SECRET = process.env.JWT_SECRET || "secret_local_dev";
      const token = jwt.sign(
        { id: funcionario.id, email: funcionario.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const { senha: _, ...funcSemSenha } = funcionario as any;
      res.json({ message: "Autenticado", token, user: funcSemSenha });
    } catch (error) {
      console.error("Erro em buscarPorLogin:", error);
      res
        .status(500)
        .json({ message: "Erro interno no servidor.", detail: String(error) });
    }
  },
};

export default funcionarioController;
