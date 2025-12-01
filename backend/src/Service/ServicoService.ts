import prisma from "../database/prisma";
import { Servico } from "../generated/prisma";

type ServicoCreateData = Omit<
  Servico,
  "id" | "dta_abertura" | "dta_conclusao"
> & {
  dta_abertura?: string | Date;
  dta_conclusao?: string | Date | null;
};

type ServicoUpdateData = Partial<ServicoCreateData>;

const toDate = (
  v: string | Date | null | undefined
): Date | null | undefined => {
  if (v === null) return null;
  if (v === undefined) return undefined;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

export const create = async (data: ServicoCreateData): Promise<Servico> => {
  const dataComDatasCorretas: any = { ...data };

  if (data.dta_abertura) {
    dataComDatasCorretas.dta_abertura = toDate(data.dta_abertura) as Date;
  }

  // Se o status for "concluido", adiciona automaticamente a data de conclusão
  if (data.status === "concluido") {
    dataComDatasCorretas.dta_conclusao = new Date();
  } else {
    // Se não for concluído, deixa null
    dataComDatasCorretas.dta_conclusao = null;
  }

  return prisma.servico.create({
    data: dataComDatasCorretas,
    include: {
      cliente: true,
      funcionario: true,
    },
  });
};

export const getAll = async (): Promise<Servico[]> => {
  return prisma.servico.findMany({
    include: {
      cliente: true,
      funcionario: true,
    },
  });
};

export const getById = async (id: number): Promise<Servico | null> => {
  return prisma.servico.findUnique({
    where: { id },
    include: {
      cliente: true,
      funcionario: true,
    },
  });
};

export const update = async (
  id: number,
  data: ServicoUpdateData
): Promise<Servico> => {
  const dadosParaAtualizar: any = { ...data };

  if (
    Object.prototype.hasOwnProperty.call(dadosParaAtualizar, "dta_abertura") &&
    dadosParaAtualizar.dta_abertura !== undefined &&
    dadosParaAtualizar.dta_abertura !== null
  ) {
    dadosParaAtualizar.dta_abertura = toDate(
      dadosParaAtualizar.dta_abertura as any
    ) as any;
  }

  // Se o status está sendo alterado para "concluido", adiciona automaticamente a data de conclusão
  if (data.status === "concluido") {
    dadosParaAtualizar.dta_conclusao = new Date();
  } else if (data.status && data.status !== "concluido") {
    // Se o status está sendo alterado para qualquer outro valor, remove a data de conclusão
    dadosParaAtualizar.dta_conclusao = null;
  }

  return prisma.servico.update({
    where: { id },
    data: dadosParaAtualizar,
    include: {
      cliente: true,
      funcionario: true,
    },
  });
};

export const remove = async (id: number): Promise<void> => {
  await prisma.servico.delete({ where: { id } });
};
