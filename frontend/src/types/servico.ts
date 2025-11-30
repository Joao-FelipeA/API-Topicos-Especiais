export interface Servico{
    id: number;
    dta_abertura: Date;
    dta_conclusao?: Date;
    motivo: string;
    status: string;
    valor_total:Float32Array;
    cliente?:{
        id: number,
        nome: string;
        cpf: string;
    };
    funcionario?:{
        id: number,
        nome:string,
        especialidade: string
    };
}