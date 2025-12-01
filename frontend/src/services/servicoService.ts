import axios from "axios";
import type { Servico } from "../types/servico"; // usar o tipo centralizado
import { API_BASE_URL } from "../config/api";

const API_BASE = import.meta.env.VITE_API_BASE || API_BASE_URL;

export type ServicoPayload = {
  motivo?: string;
  dta_abertura?: string;
  clienteID?: number;
  funcionarioID?: number;
  status?: string;
  valor_total?: number;
  dta_conclusao?: string | null;
};

export async function getServicos(): Promise<Servico[]> {
  const resp = await axios.get<Servico[]>(`${API_BASE}/servicos`);
  return resp.data;
}

export async function createServico(payload: ServicoPayload): Promise<Servico> {
  const resp = await axios.post<Servico>(`${API_BASE}/servicos`, payload);
  return resp.data;
}

export async function updateServico(
  id: number,
  payload: Partial<ServicoPayload>
): Promise<Servico> {
  const resp = await axios.put<Servico>(`${API_BASE}/servicos/${id}`, payload);
  return resp.data;
}

export default {
  getServicos,
  createServico,
  updateServico,
};
