export const getApiUrl = (): string => {
  
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  
  if (import.meta.env.PROD) {
    return "";
  }

  
  return "http://localhost:3001";
};

export const API_BASE_URL = getApiUrl();

// URLs dos endpoints
export const API_ENDPOINTS = {

  LOGIN: `${API_BASE_URL}/login`,

  SERVICOS: `${API_BASE_URL}/servicos`,

  CLIENTES: `${API_BASE_URL}/clientes`,

  FUNCIONARIOS: `${API_BASE_URL}/funcionarios`,
};