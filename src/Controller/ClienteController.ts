import { Request, Response } from "express";
import ClienteService from "../Service/ClienteService";
import { Cliente } from "../generated/prisma";
import {
  createClienteSchema,
  updateClienteSchema,
} from "../Schemas/validation";
import { z } from "zod";

const clienteController = {
  async getClientes(req: Request, res: Response): Promise<void> {
    try {
      const clientes: Cliente[] = await ClienteService.getClientes();
      res.status(201).json(clientes);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar clientes." });
    }
  },

  async getClientesById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res
        .status(400)
        .json({ message: "ID inválido. Deve ser um número inteiro positivo" });
      return;
    }

    const cliente: Cliente | null = await ClienteService.getClienteById(id);
    if (!cliente) {
      res.status(404).json({ message: "Cliente não encontrado" });
      return;
    }

    res.json(cliente);
  },

  async createCliente(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createClienteSchema.parse(req.body);
      const cliente: Cliente = await ClienteService.createCliente(
        validatedData
      );
      res.status(201).json(cliente);
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

if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === 'P2002' &&
      "meta" in error &&
      (error as any).meta?.target?.includes('CPF')
    ) {
      res.status(409).json({ message: "Já existe um cliente com este CPF" });
      return;
    }

    res.status(500).json({ 
      message: "Erro interno do servidor ao criar cliente",
      error: typeof error === "object" && error !== null && "message" in error ? (error as any).message : String(error)
    });
    }
  },

  async updateCliente(req: Request, res: Response): Promise<void> {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        res
          .status(400)
          .json({
            message: "ID inválido. Deve ser um número inteiro positivo",
          });
        return;
      }

      const validatedData = updateClienteSchema.parse(req.body);

      if (Object.keys(validatedData).length === 0) {
        res
          .status(400)
          .json({ message: "Nenhum dado para atualizar foi fornecido." });
        return;
      }

      const cliente: Cliente = await ClienteService.updateCliente(
        id,
        validatedData
      );
      res.json(cliente);
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

      res.status(500).json({ message: "Erro ao atualizar cliente." });
    }
  },

  async deleteCliente(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID invalido" });
      return;
    }

    try {
      await ClienteService.deleteCliente(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "Cliente não encontrado" });
    }
  },
};

export default clienteController;
