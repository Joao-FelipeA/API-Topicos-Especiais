import prisma from "../database/prisma";
import { Funcionario } from "../generated/prisma";
import bcrypt from "bcryptjs";

export class FuncionarioService {
  async listarTodos(): Promise<Funcionario[]> {
    return prisma.funcionario.findMany();
  }

  async buscarPorId(id: number): Promise<Funcionario | null> {
    return prisma.funcionario.findUnique({ where: { id } });
  }

  async criar(dados: {
    nome: string;
    CPF: string;
    senha: string;
    telefone: number;
    email: string;
    especialidade: string;
  }): Promise<Funcionario> {
    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(dados.senha, 10);
    const dataToSave = { ...dados, senha: hashedPassword };
    return prisma.funcionario.create({ data: dataToSave });
  }

  async atualizar(
    id: number,
    dados: {
      nome?: string;
      telefone?: number;
      email?: string;
      especialidade?: string;
    }
  ): Promise<Funcionario> {
    return prisma.funcionario.update({ where: { id }, data: dados });
  }

  async deletar(id: number): Promise<void> {
    await prisma.funcionario.delete({ where: { id } });
  }

  async buscarPorLogin(
    email: string,
    senha: string
  ): Promise<Funcionario | null> {
    // Busca por email e compara a senha usando bcrypt
    const funcionario = await prisma.funcionario.findFirst({
      where: { email },
    });
    if (!funcionario) return null;
    const isMatch = await bcrypt.compare(senha, funcionario.senha);
    return isMatch ? funcionario : null;
  }
}
