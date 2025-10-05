import  prisma  from '../database/prisma';
import { Servicos } from '../generated/prisma';

// Novo: tipos de entrada que aceitam string | Date | null conforme necessário
type ServicoCreateData = Omit<Servicos, 'id' | 'dta_abertura' | 'dta_conclusao'> & {
  dta_abertura: string | Date;
  dta_conclusao?: string | Date | null;
};

// 2. Tipo de dados para Atualização (Qualquer campo, mas opcional)
type ServicoUpdateData = Partial<ServicoCreateData>;

// Helper para normalizar valores de data recebidos via API
const toDate = (v: string | Date | null | undefined): Date | null | undefined => {
  if (v === null) return null;
  if (v === undefined) return undefined;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

export const create = async (data: ServicoCreateData): Promise<Servicos> => {
  // Converte strings para Date quando necessário
  const dataComDatasCorretas: any = {
    ...data,
    dta_abertura: toDate(data.dta_abertura) as Date, // dta_abertura é obrigatório no DTO
  };

  // Só inclui dta_conclusao se não for null
  const dtaConclusao = data.dta_conclusao !== undefined ? toDate(data.dta_conclusao) : undefined;
  if (dtaConclusao !== null && dtaConclusao !== undefined) {
    dataComDatasCorretas.dta_conclusao = dtaConclusao;
  }

  return prisma.servicos.create({
    data: dataComDatasCorretas,
  });
};

export const getAll = async (): Promise<Servicos[]> => {
  return prisma.servicos.findMany();
};

export const getById = async (id: number): Promise<Servicos | null> => {
  return prisma.servicos.findUnique({
    where: { id },
  });
};

export const update = async (id: number, data: ServicoUpdateData): Promise<Servicos> => {
  // Cria um objeto de dados para atualização
  const dadosParaAtualizar: any = { ...data };

  // Se a propriedade dta_abertura for passada, converte para Date
  if (Object.prototype.hasOwnProperty.call(dadosParaAtualizar, 'dta_abertura') && dadosParaAtualizar.dta_abertura !== undefined && dadosParaAtualizar.dta_abertura !== null) {
    dadosParaAtualizar.dta_abertura = toDate(dadosParaAtualizar.dta_abertura as any) as any;
  }

  // Se a propriedade dta_conclusao for passada, trata null/undefined/Date corretamente
  if (Object.prototype.hasOwnProperty.call(dadosParaAtualizar, 'dta_conclusao')) {
    const v = dadosParaAtualizar.dta_conclusao as string | Date | null | undefined;
    if (v === null) {
      // Prisma does not accept null for update, so use Prisma's field operation
      dadosParaAtualizar.dta_conclusao = { set: null };
    } else if (v === undefined) {
      // não alterar o campo (cliente não enviou valor)
      delete dadosParaAtualizar.dta_conclusao;
    } else {
      dadosParaAtualizar.dta_conclusao = toDate(v) as any;
    }
  }

  return prisma.servicos.update({
    where: { id },
    data: dadosParaAtualizar,
  });
};

export const remove = async (id: number): Promise<Servicos> => {
  return prisma.servicos.delete({ where: { id } });
};