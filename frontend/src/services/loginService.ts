import axios from "axios";
import type { Gerente } from "../types/gerente";
import { API_ENDPOINTS } from "../config/api";

export const login = async (email: string, senha: string): Promise<Gerente> => {
  const response = await axios.post<Gerente>(API_ENDPOINTS.LOGIN, {
    email,
    senha,
  });
  return response.data;
};
