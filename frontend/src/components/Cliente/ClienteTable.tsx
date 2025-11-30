// ...existing code...
import React, { useEffect, useState } from "react";

type Cliente = {
    id: number | string;
    nome: string;
    email?: string;
    telefone?: string;
};

type Props = {
    apiBase?: string; // ex: "/api/clientes" ou "http://localhost:5000/api/clientes"
    onEdit?: (cliente: Cliente) => void;
    onAdd?: () => void;
};

export default function ClienteTable({ apiBase = "/api/clientes", onEdit, onAdd }: Props) {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        async function fetchClientes() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(apiBase, { signal: controller.signal });
                if (!res.ok) throw new Error(`Erro ao buscar clientes: ${res.status} ${res.statusText}`);
                const data = await res.json();
                setClientes(Array.isArray(data) ? data : []);
            } catch (err: any) {
                if (err.name !== "AbortError") setError(err.message || "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        }
        fetchClientes();
        return () => controller.abort();
    }, [apiBase]);

    async function handleDelete(id: number | string) {
        if (!confirm("Confirma exclusão deste cliente?")) return;
        try {
            const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`Falha ao excluir: ${res.status}`);
            setClientes(prev => prev.filter(c => String(c.id) !== String(id)));
        } catch (err: any) {
            alert(err.message || "Erro ao excluir cliente");
        }
    }

    function handleEdit(cliente: Cliente) {
        if (onEdit) return onEdit(cliente);
        // fallback: navega para rota de edição se não houver callback
        window.location.href = `${window.location.origin}/clientes/editar/${cliente.id}`;
    }

    function handleAdd() {
        if (onAdd) return onAdd();
        window.location.href = `${window.location.origin}/clientes/novo`;
    }

    return (
        <div style={{ padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>Clientes</h3>
                <div>
                    <button onClick={handleAdd} style={{ padding: "6px 10px", cursor: "pointer" }}>Novo Cliente</button>
                </div>
            </div>

            {loading && <p>Carregando clientes...</p>}
            {error && <p style={{ color: "red" }}>Erro: {error}</p>}

            {!loading && !error && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Nome</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Email</th>
                            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Telefone</th>
                            <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: 12 }}>Nenhum cliente encontrado.</td>
                            </tr>
                        )}
                        {clientes.map((c) => (
                            <tr key={c.id}>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{c.nome}</td>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{c.email ?? "-"}</td>
                                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{c.telefone ?? "-"}</td>
                                <td style={{ padding: 8, textAlign: "right", borderBottom: "1px solid #f0f0f0" }}>
                                    <button onClick={() => handleEdit(c)} style={{ marginRight: 8, cursor: "pointer" }}>Editar</button>
                                    <button onClick={() => handleDelete(c.id)} style={{ cursor: "pointer" }}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
// ...existing code...