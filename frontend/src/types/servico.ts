import type { Funcionario } from "./funcionario";
import type { Cliente } from "./cliente";
export interface Servico{
    id: number;
    dta_abertura: Date;
    dta_conclusao?: Date;
    motivo: string;
    status: string;
    valor_total:Float32Array;
    cliente?: Cliente;
    funcionario?: Funcionario;
    clienteID?: number;      
    funcionarioID?: number;
}