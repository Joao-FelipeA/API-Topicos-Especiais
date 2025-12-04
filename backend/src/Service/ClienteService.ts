import prisma from "../database/prisma";
import { Cliente } from "@prisma/client";

const ClienteService = {
    
    async getClientes(): Promise<Cliente[]>{
        return prisma.cliente.findMany();
    },

    async getClienteById(id: number): Promise<Cliente | null>{
        return prisma.cliente.findUnique({where: {id}});
    },
    
    async createCliente(data: {nome: string, CPF: string, CNPJ?: string | null, email: string, telefone: number}): Promise<Cliente>{
        return prisma.cliente.create({ data })
    },
    
    async updateCliente (id: number, data: {nome?: string, CPF?: string, CNPJ?: string | null, email?: string, telefone?: number}): Promise<Cliente>{
        return prisma.cliente.update({
            where:  { id },
            data,
        })
    },

    async deleteCliente(id: number): Promise<void> {
        await prisma.cliente.delete({ where: { id }})       
    }
};

export default ClienteService