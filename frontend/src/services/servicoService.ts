import axios from "axios";
import type { Servico } from "../types/servico";
import { API_ENDPOINTS } from "../config/api";

export type ServicoPayload = {
  motivo?: string;
  dta_abertura?: string;
  clienteId?: number;
  funcionarioId?: number;
  status?: string;
  valor_total?: number;
  dta_conclusao?: string | null;
};

export async function getServicos(): Promise<Servico[]> {
  const resp = await axios.get<Servico[]>(`${API_ENDPOINTS.SERVICOS}`);
  return resp.data;
}

export async function createServico(payload: ServicoPayload): Promise<Servico> {
  const resp = await axios.post<Servico>(`${API_ENDPOINTS.SERVICOS}`, payload);
  return resp.data;
}

export async function updateServico(
  id: number,
  payload: Partial<ServicoPayload>
): Promise<Servico> {
  const resp = await axios.put<Servico>(`${API_ENDPOINTS.SERVICOS}/${id}`, payload);
  return resp.data;
}


export async function deleteServico( id:number ): Promise<void>{
  await axios.delete (`${API_ENDPOINTS.SERVICOS}/${id}`);
}

export default {
  getServicos,
  createServico,
  updateServico,
  deleteServico
};
