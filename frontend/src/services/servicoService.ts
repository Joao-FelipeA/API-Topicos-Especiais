import axios from "axios";
import type { Servico } from "../types/servico";
import { API_ENDPOINTS } from "../config/api";

export const getServicos = async (): Promise<Servico[]> =>{
    const response = await axios.get(API_ENDPOINTS.SERVICOS);
    return response.data
};

export const deleteServicos = async (id:number): Promise<void> =>{
    await axios.delete(`${API_ENDPOINTS.SERVICOS}/${id}`);
}

export const updateServicos = async (id:number, dados: Partial<Servico>): Promise<Servico> =>{
    const response = await axios.put(`${API_ENDPOINTS.SERVICOS}/${id}`, dados, {});
    return response.data;
}

export const CreateServicos = async (dados: Omit<Servico, "id">): Promise<Servico> =>{
    const response = await axios.post(API_ENDPOINTS.SERVICOS, dados, {});
    return response.data;
};