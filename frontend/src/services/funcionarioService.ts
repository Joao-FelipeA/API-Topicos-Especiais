import axios from "axios";
import type {Funcionario} from "../types/funcionario"
import { API_ENDPOINTS } from "../config/api";


export const getFuncionarios = async (): Promise<Funcionario[]> => {
    const response = await axios.get(API_ENDPOINTS.FUNCIONARIOS);
    return response.data;
}