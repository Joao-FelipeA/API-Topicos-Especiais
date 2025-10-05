import { Request, Response } from 'express';
// 1. O nome do service deve ser mudado para refletir a nova entidade
import * as servicosService from '../Service/ServicoService';

// 2. CREATE: Cria um novo Serviço
export const createServico = async (req: Request, res: Response) => {
  try {
    // 3. Muda a variável e a função do service
    const servico = await servicosService.create(req.body);
    return res.status(201).json(servico);
  } catch (error: any) {
    // 400 Bad Request para erros de validação ou dados
    return res.status(400).json({ message: error.message });
  }
};

// 5. READ ALL: Retorna todos os Serviços
export const getAllServicos = async (req: Request, res: Response) => {
  try {
    // 6. Muda a variável e a função do service
    const servicos = await servicosService.getAll();
    return res.json(servicos);
  } catch (error: any) {
    // 500 Internal Server Error para erros de servidor/conexão
    return res.status(500).json({ message: error.message });
  }
};

// 7. READ BY ID: Retorna um Serviço específico
export const getServicoById = async (req: Request, res: Response) => {
  try {
    // Converte o ID do parâmetro da URL para número
    const servico = await servicosService.getById(Number(req.params.id));
    // 404 Not Found se não encontrar
    if (!servico) return res.status(404).json({ message: 'Serviço não encontrado.' });
    return res.json(servico);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// 8. UPDATE: Atualiza um Serviço específico
export const updateServico = async (req: Request, res: Response) => {
  try {
    // 9. Usa o ID e os dados do body para atualizar
    const servico = await servicosService.update(Number(req.params.id), req.body);
    return res.json(servico);
  } catch (error: any) {
    // O código 'P2025' é o erro padrão do Prisma para "registro não encontrado para a operação de update/delete"
    if (error.code === 'P2025') return res.status(404).json({ message: 'Serviço não encontrado.' });
    return res.status(500).json({ message: error.message });
  }
};

// 10. DELETE: Remove um Serviço específico
export const deleteServico = async (req: Request, res: Response) => {
  try {
    // 11. Chama a função de remoção
    await servicosService.remove(Number(req.params.id));
    // 204 No Content, pois o recurso foi deletado com sucesso
    return res.status(204).send();
  } catch (error: any) {
    // Verifica novamente se o registro existia
    if (error.code === 'P2025') return res.status(404).json({ message: 'Serviço não encontrado.' });
    return res.status(500).json({ message: error.message });
  }
};