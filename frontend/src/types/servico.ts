export interface Servico{
    id: number;
    dta_abertura: Date;
    dta_conclusao?: Date;
    motivo: string;
    status: string;
    valor_total:Float32Array;
    cliente?:{
        nome: string;
        cpf: string;
    };
    funcionario?:{
        nome:string,
        especialidade: string
    };
}