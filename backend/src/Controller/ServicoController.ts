import { Request, Response } from "express";
import * as servicosService from "../Service/ServicoService";
import {
  createServicoSchema,
  updateServicoSchema,
} from "../Schemas/validation";
import { z } from "zod";
import prisma from "../database/prisma";

export const createServico = async (req: Request, res: Response) => {
  try {
    const validatedData = createServicoSchema.parse(req.body);

    const clienteExiste = await prisma.cliente.findUnique({
      where: { id: validatedData.clienteID },
    });

    if (!clienteExiste) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const funcionarioExiste = await prisma.funcionario.findUnique({
      where: { id: validatedData.funcionarioID },
    });

    if (!funcionarioExiste) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    const servico = await servicosService.create(validatedData);
    return res.status(201).json(servico);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const getAllServicos = async (req: Request, res: Response) => {
  try {
    const servicos = await servicosService.getAll();
    return res.status(200).json(servicos);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOpcoesParaServico = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    const funcionarios = await prisma.funcionario.findMany({
      select: {
        id: true,
        nome: true,
        especialidade: true,
      },
    });

    return res.json({
      clientes,
      funcionarios,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getServicoById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ message: "ID inválido. Deve ser um número inteiro positivo" });
    }

    const servico = await servicosService.getById(id);
    if (!servico) {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }
    return res.json(servico);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateServico = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ message: "ID inválido. Deve ser um número inteiro positivo" });
    }

    const validatedData = updateServicoSchema.parse(req.body);

    if (Object.keys(validatedData).length === 0) {
      return res
        .status(400)
        .json({ message: "Nenhum dado para atualizar foi fornecido." });
    }

    if (validatedData.clienteID) {
      const clienteExiste = await prisma.cliente.findUnique({
        where: { id: validatedData.clienteID },
      });

      if (!clienteExiste) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
    }

    if (validatedData.funcionarioID) {
      const funcionarioExiste = await prisma.funcionario.findUnique({
        where: { id: validatedData.funcionarioID },
      });

      if (!funcionarioExiste) {
        return res.status(404).json({ message: "Funcionário não encontrado" });
      }
    }

    const servico = await servicosService.update(id, validatedData);
    return res.json(servico);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const deleteServico = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res
        .status(400)
        .json({ message: "ID inválido. Deve ser um número inteiro positivo" });
    }

    await servicosService.remove(id);
    return res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }
    return res.status(500).json({ message: error.message });
  }
};
