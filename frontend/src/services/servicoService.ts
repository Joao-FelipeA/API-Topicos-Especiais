import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE as string) || ((globalThis as any).process?.env?.REACT_APP_API_BASE as string) || "http://localhost:3000";

export type ServicoPayload = {
  motivo?: string;
  dta_abertura?: string;
  clienteID?: number;
  funcionarioID?: number;
  status?: string;
  valor_total?: number;
  dta_conclusao?: string | null;
};

export interface Servico {
  id: number;
  dta_abertura: string;
  dta_conclusao: string | null;
  status: string;
  valor_total: number;
  clienteID?: number;
  funcionarioID?: number;
  cliente?: any;
  funcionario?: any;
}

export async function getServicos() {
  const resp = await axios.get<Servico[]>(`${API_BASE}/servicos`);
  return resp.data;
}

// aceitar o payload com campos opcionais
export async function createServico(payload: ServicoPayload) {
  const resp = await axios.post<Servico>(`${API_BASE}/servicos`, payload);
  return resp.data;
}

// update também recebe payload parcial
export async function updateServico(id: number, payload: Partial<ServicoPayload>) {
  const resp = await axios.put<Servico>(`${API_BASE}/servicos/${id}`, payload);
  return resp.data;
}

export default {
  getServicos,
  createServico,
  updateServico,
};