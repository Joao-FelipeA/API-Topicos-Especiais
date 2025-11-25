import React, { useState, useEffect } from 'react';
// Certifique-se de que o 'axios' está instalado (npm install axios)
import axios from 'axios'; 

// --- 1. Definição de Tipos (Interface) para os Dados Recebidos ---
// Estes tipos refletem o que sua API retorna (Servico com Cliente e Funcionario)
interface Cliente {
    nome: string;
    email: string;
}

interface Funcionario {
    nome: string;
    especialidade: string;
}

interface Servico {
    id: number;
    dta_abertura: string;
    dta_conclusao: string | null;
    status: string;
    valor_total: number;
    // As propriedades abaixo vêm do 'include' que configuramos no backend
    cliente: Cliente;
    funcionario: Funcionario;
}

// --- 2. Componente de Página Servicos ---
export function Servicos() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchServicos() {
            try {
                // ATENÇÃO: Substitua 'http://localhost:3000' pela URL base da sua API backend
                const API_URL = 'http://localhost:3000/servicos'; 
                
                const response = await axios.get<Servico[]>(API_URL); 
                setServicos(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar serviços:", err);
                setError("Não foi possível carregar a lista de serviços. Verifique se o servidor backend está ativo.");
                setLoading(false);
            }
        }

        fetchServicos();
    }, []);

    // --- 3. Renderização de Estado ---
    if (loading) {
        return <div style={{ padding: '20px', fontSize: '18px' }}>Carregando serviços...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px', fontSize: '18px' }}>Erro: {error}</div>;
    }

    // --- 4. Renderização da Tabela de Serviços ---
    return (
        <div style={{ padding: '20px' }}>
            <h1>Lista de Serviços</h1>
            
            {servicos.length === 0 ? (
                <p>Nenhum serviço encontrado no momento. Certifique-se de que há dados no banco.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: '1px solid #ccc' }}>
                    <thead style={{ backgroundColor: '#f4f4f4' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc' }}>Data Abertura</th>
                            <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ccc' }}>Valor Total</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc' }}>Cliente</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ccc' }}>Funcionário</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicos.map((servico) => (
                            <tr key={servico.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{servico.id}</td>
                                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{servico.status}</td>
                                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{new Date(servico.dta_abertura).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ccc' }}>R$ {servico.valor_total.toFixed(2)}</td>
                                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{servico.cliente.nome}</td>
                                <td style={{ padding: '12px', border: '1px solid #ccc' }}>{servico.funcionario.nome} ({servico.funcionario.especialidade})</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}