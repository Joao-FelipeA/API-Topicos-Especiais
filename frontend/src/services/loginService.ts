import axios from "axios";

declare const process: { env: { REACT_APP_API_BASE?: string } };

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

type LoginResponse = {
  token?: string;
  funcionario?: any;
  [key: string]: any;
};

async function login(email: string, senha: string): Promise<LoginResponse> {
  const resp = await axios.post(`${API_BASE}/auth/login`, { email, senha });
  return resp.data;
}

export default {
  login,
};