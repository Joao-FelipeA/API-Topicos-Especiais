import prisma from "../database/prisma";
import { FuncionarioService } from "../Service/FuncionarioService";
import ClienteService from "../Service/ClienteService";
import * as servicoService from "../Service/ServicoService";

async function main() {
  console.log("Iniciando seed...");

  // Limpeza de dados existentes
  await prisma.servico.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.funcionario.deleteMany();

  const funcionarioService = new FuncionarioService();

  // Criar funcionarios
  const funcionario1 = await funcionarioService.criar({
    nome: "Calebe",
    telefone: 1199999000,
    email: "calebe@example.com",
    especialidade: "Eletricista",
    CPF: "12345678901",
    senha: "123456",
  });

  const funcionario2 = await funcionarioService.criar({
    nome: "João Felipe",
    telefone: 1188888000,
    email: "joaofelipe@example.com",
    especialidade: "Encanador",
    CPF: "10987654321",
    senha: "123456",
  });

  // Criar clientes
  const cliente1 = await ClienteService.createCliente({
    nome: "Thiago",
    CPF: "11122233344",
    email: "thiago@example.com",
    telefone: 1191111222,
  });

  const cliente2 = await ClienteService.createCliente({
    nome: "Laura",
    CPF: "55566677788",
    email: "laura@example.com",
    telefone: 1193333444,
  });

  // Criar serviços
  await servicoService.create({
    motivo: "Curto na rede eletrica",
    status: "aberto",
    valor_total: 150.5,
    clienteId: cliente1.id,
    funcionarioId: funcionario1.id,
  });

  await servicoService.create({
    motivo: "Infiltração",
    status: "concluido",
    valor_total: 300,
    clienteId: cliente2.id,
    funcionarioId: funcionario2.id,
  });

  console.log("Seed finalizado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
