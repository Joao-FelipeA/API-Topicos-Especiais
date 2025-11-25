import { z } from "zod";

export const createServicoSchema = z.object({
  dataHora: z.string().min(1, "Data e hora são obrigatórias"),
  motivo: z.string().optional(),
  clienteId: z
    .number({ message: "Cliente é obrigatório" })
    .int()
    .positive("Selecione um cliente válido"),
  funcionarioId: z
    .number({ message: "Funcionário é obrigatório" })
    .int()
    .positive("Selecione um funcionário válido"),
});

export const updateServicoSchema = createServicoSchema.extend({
  id: z.number().int().positive(),
});