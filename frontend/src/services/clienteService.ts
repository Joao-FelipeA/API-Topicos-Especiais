import axios from "axios";
import type {Cliente} from "../types/cliente";
import { API_ENDPOINTS } from "../config/api";

export const getClientes = async(): Promise<Cliente[]> => {
    const res = await axios.get<Cliente[]>(API_ENDPOINTS.CLIENTES);
    return res.data
};

export const deleteClientes = async (id: number): Promise<void> => {
  await axios.delete(`${API_ENDPOINTS.CLIENTES}/${id}`);
};

export const updateClientes = async (id: number, dados: Cliente): Promise<Cliente> => {
    const res = await axios.put<Cliente>(`${API_ENDPOINTS.CLIENTES}/${id}`, dados);
    return res.data;
};

export const createClientes = async (dados: Omit<Cliente, "id">): Promise <Cliente> => {
    const res = await axios.post<Cliente>(API_ENDPOINTS.CLIENTES, dados);
    return res.data;
};

export default{
    getClientes,
    deleteClientes,
    updateClientes,
    createClientes,
};