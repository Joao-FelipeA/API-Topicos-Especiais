import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FuncionarioService {
  async listarTodos() {
    return prisma.funcionario.findMany();
  }

  async buscarPorId(id: number) {
    return prisma.funcionario.findUnique({ where: { id } });
  }

  async criar(dados: any) {
    return prisma.funcionario.create({ data: dados });
  }

  async atualizar(id: number, dados: any) {
    return prisma.funcionario.update({ where: { id }, data: dados });
  }

  async deletar(id: number) {
    return prisma.funcionario.delete({ where: { id } });
  }
}
