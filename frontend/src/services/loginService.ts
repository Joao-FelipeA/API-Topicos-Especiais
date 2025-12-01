import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

type LoginResponse = {
  token?: string;
  user?: any;
  [key: string]: any;
};

async function login(email: string, senha: string): Promise<LoginResponse> {
  const resp = await axios.post(API_ENDPOINTS.LOGIN, { email, senha });
  return resp.data;
}

export default {
  login,
};
