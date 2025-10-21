import {z} from "zod";

export const createClienteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  CPF: z.string().min(11, "CPF deve ter 11 dígitos"),
  CNPJ: z.string().optional(),
  email: z.string().email("Email deve ser válido"),
  telefone: z.string().or(z.number()).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
  )
});

export const updateClienteSchema = createClienteSchema.partial();

export const createFuncionarioSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatorio"),
    telefone: z.string().or(z.number()).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
    ),
    email: z.string().email("Insira um formato de email valido"),
    especialidade: z.string().min(3, "Especialidade é obrigatorio")

});

export const updateFuncionarioSchema = createFuncionarioSchema.partial();

export const createServicoSchema = z.object({
    dta_abertura: z.string().datetime("Data deve estar no formato ISO 8601").optional(),
    dta_conclusao: z.string().datetime("Data deve estar no formato ISO 8601").optional(),
    status: z.string().min(1, "É necessario deixar o status: em aberto, sendo realizado, concluido"),
    valor_total: z.number().positive("O valor total deve ser positivo"),
    clienteID: z.number().int().positive("ID do cliente é obrigatório e deve ser um número positivo"),
    funcionarioID: z.number().int().positive("ID do funcionário é obrigatório e deve ser um número positivo")
});

export const updateServicoSchema = createServicoSchema.partial();