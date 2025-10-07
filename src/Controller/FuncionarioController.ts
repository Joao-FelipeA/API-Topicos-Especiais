import { Request, Response } from "express";
import { Funcionario } from "../generated/prisma";
import { FuncionarioService } from "../Service/FuncionarioService";
import {
  createFuncionarioSchema,
  updateFuncionarioSchema,
} from "../Schemas/validation";
import prisma from "../database/prisma";
import { z } from "zod";

const service = new FuncionarioService();

const funcionarioController = {
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const funcionarios = await prisma.funcionario.findMany({
        include: {
          servicos: {
            select: {
              id: true
            }
          }
        }
      });
      res.status(200).json(funcionarios);
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
              id: true
            }
          }
        }
      });

      if (!funcionario) {
        res.status(404).json({ message: "Funcionário não encontrado" });
        return;
      }

      res.json(funcionario);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar funcionário." });
    }
  },
  async criar(req: Request, res: Response) {
    try {
      const validatedData = createFuncionarioSchema.parse(req.body);
      const funcionario: Funcionario = await service.criar(validatedData);
      res.status(201).json(funcionario);
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
  }
}

export default funcionarioController;