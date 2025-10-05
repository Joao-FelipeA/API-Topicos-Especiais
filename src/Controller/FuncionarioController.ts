import { Request, Response } from "express";
import { FuncionarioService } from "../Service/FuncionarioService";

const service = new FuncionarioService();

export class FuncionarioController {
  async listar(req: Request, res: Response) {
    const funcionarios = await service.listarTodos();
    res.json(funcionarios);
  }

  async buscar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const funcionario = await service.buscarPorId(id);
    if (!funcionario) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }
    res.json(funcionario);
  }

  async criar(req: Request, res: Response) {
    const { nome, telefone, email, especialidade } = req.body;

    if (!nome) {
      return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
    }

    const novoFuncionario = await service.criar({
      nome,
      telefone,
      email,
      especialidade,
    });

    res.status(201).json(novoFuncionario);
  }

  async atualizar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { nome, telefone, email, especialidade } = req.body;

    try {
      const funcionarioAtualizado = await service.atualizar(id, {
        nome,
        telefone,
        email,
        especialidade,
      });
      res.json(funcionarioAtualizado);
    } catch (error) {
      res.status(404).json({ message: "Funcionário não encontrado." });
    }
  }

  async deletar(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      await service.deletar(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "Funcionário não encontrado." });
    }
  }
}
