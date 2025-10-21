import prisma from "../database/prisma";
import { Funcionario } from "../generated/prisma";

export class FuncionarioService {
  async listarTodos(): Promise<Funcionario[]> {
    return prisma.funcionario.findMany();
  }

  async buscarPorId(id: number): Promise<Funcionario | null> {
    return prisma.funcionario.findUnique({ where: { id } });
  }

  async criar(dados: {nome: string, telefone: number, email: string, especialidade: string}): Promise<Funcionario> {
    return prisma.funcionario.create({ data: dados });
  }

  async atualizar(id: number, dados: {nome?: string, telefone?: number, email?: string, especialidade?: string}): Promise<Funcionario> {
    return prisma.funcionario.update({ where: { id }, data: dados });
  }

  async deletar(id: number): Promise<void> {
    await prisma.funcionario.delete({ where: { id } });
  }
}
