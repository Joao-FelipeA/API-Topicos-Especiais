import {Request, Response } from "express";
import ClienteService from "../Service/ClienteService";
import {Cliente} from "../generated/prisma";

const clienteController = {
    async getClientes(req: Request, res: Response): Promise<void>{
            const clientes: Cliente[] = await ClienteService.getClientes();
            res.json(clientes);
        },

    async getClientesById(req: Request, res: Response): Promise<void>{
        const id: number = parseInt(req.params.id, 10);
        if(isNaN(id) || id <=0 ){
            res.status(400).json({ message: "ID inválido. Deve ser um número inteiro positivo"});
            return;
        }

        const cliente: Cliente | null = await ClienteService.getClienteById(id);
        if(!cliente){
            res.status(404).json({message: "Cliente não encontrado"});
            return;
        }

        res.json(cliente);
    },

    async createCliente(req: Request, res: Response): Promise<void>{
        const {nome, CPF, CNPJ, email, telefone }: {nome: string, CPF: string, CNPJ?: string, email: string, telefone: number} = req.body

        if(typeof nome !== 'string' || nome.trim() === ""){
            res.status(400).json({message: "O nome é obrigatorio"});
            return;
        }

        if(typeof CPF !== 'string' || CPF.trim() === ""){
            res.status(400).json({message: "O CPF deve ser preenchido"});
            return;
        }

        if(typeof email !== 'string' || email.trim() === ""){
            res.status(400).json({message: "O email deve ser preenchido"})
            return;
        }

        let telefoneNumber: number;
        if (typeof telefone === 'string') {
            telefoneNumber = parseInt(telefone, 10);
        } else if (typeof telefone === 'number') {
            telefoneNumber = telefone;
        } else {
            res.status(400).json({message: "O telefone deve ser um número válido"});
            return;
        }

        if (isNaN(telefoneNumber) || telefoneNumber <= 0) {
            res.status(400).json({message: "O telefone deve ser um número válido"});
            return;
        }

        try {
            const cliente: Cliente = await ClienteService.createCliente({ nome, CPF, CNPJ, email, telefone: telefoneNumber});
            res.status(201).json(cliente);
        } catch( error ){
            res.status(409).json({ message: "Já existe um cliente com este CPF"});
        }
    },

    async updateCliente(req: Request, res: Response): Promise<void>{
        const id: number = parseInt(req.params.id, 10);
        if(isNaN(id) || id <= 0){
            res.status(400).json({message: "ID inválido. Deve ser um número inteiro positivo"})
        }

        const {nome, CPF, CNPJ, email, telefone}: {nome?: string, CPF?: string, CNPJ?: string, email?: string, telefone?: number } = req.body;
        let dataToUpdate: {nome?: string, CPF?: string, CNPJ?: string, email?: string, telefone?: number} = {};

        if (nome !== undefined){
            if(typeof nome !== 'string' || nome.trim() === ""){
            res.status(400).json({message: "O nome não pode ficar vazio"});
            return;
            }
            dataToUpdate.nome = nome;
        }

        if(CPF !== undefined){
        if(typeof CPF !== 'string' || CPF.trim() === ""){
            res.status(400).json({message: "O CPF não pode ficar vazio"});
            return;
        }
        dataToUpdate.CPF = CPF;
    }

        if(CNPJ !== undefined){
            if(typeof CNPJ !== 'string' || CNPJ.trim() === ""){
            res.status(400).json({message: "O CNPJ não pode ficar vazio"});
            return;
        }
        dataToUpdate.CNPJ = CNPJ;
    }

        if (email !== undefined){
            if(typeof email !== 'string' || email.trim() === ""){
            res.status(400).json({message: "O email não pode ficar vazio"})
            return;
        }
        dataToUpdate.email = email;
        }

        if( telefone !== undefined){
            let telefoneNumber: number;
            if (typeof telefone === 'string') {
                telefoneNumber = parseInt(telefone, 10);
            } else if (typeof telefone === 'number') {
                telefoneNumber = telefone;
            } else {
                res.status(400).json({message: "O telefone deve ser um número válido"});
                return;
            }

            if (isNaN(telefoneNumber) || telefoneNumber <= 0) {
                res.status(400).json({message: "O telefone deve ser um número válido"});
                return;
            }
            dataToUpdate.telefone = telefoneNumber;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            res.status(400).json({ message: "Nenhum dado para atualizar foi fornecido (nome ou idade)." });
            return;
        }

        try {
            if (
                typeof dataToUpdate.nome === 'string' &&
                typeof dataToUpdate.CPF === 'string' &&
                typeof dataToUpdate.email === 'string' &&
                typeof dataToUpdate.telefone === 'number'
            ) {
                const cliente: Cliente = await ClienteService.updateCliente(id, {
                    nome: dataToUpdate.nome,
                    CPF: dataToUpdate.CPF,
                    CNPJ: dataToUpdate.CNPJ ?? null,
                    email: dataToUpdate.email,
                    telefone: dataToUpdate.telefone
                });
                res.json(cliente);
            } else {
                res.status(400).json({ message: "Todos os campos obrigatórios (nome, CPF, email, telefone) devem ser fornecidos para atualização." });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar cliente." });
        }

    },

    async deleteCliente(req: Request, res: Response): Promise<void>{
        const id: number = parseInt(req.params.id, 10);
        if (isNaN(id) || id<= 0){
            res.status(400).json({ message: "ID invalido"})
            return;
        }

        try{
            await ClienteService.deleteCliente(id);
            res.status(204).send();
        } catch (error){
            res.status(404).json({ message: "Cliente não encontrado"})
        }
    }


}

export default clienteController
    
