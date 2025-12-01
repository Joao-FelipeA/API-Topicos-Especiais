// ...existing code...
import React, { useEffect, useState } from "react";
import clienteService from "../../services/clienteService";
import type { Cliente } from "../../types/cliente";

type Props = {
  apiBase?: string; // manteve por compatibilidade, porém o serviço usa axios e API_ENDPOINTS
  onEdit?: (cliente: Cliente) => void;
  onAdd?: () => void;
};

export default function ClienteTable({ apiBase, onEdit, onAdd }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchClientes() {
      setLoading(true);
      setError(null);
      try {
        const data = await clienteService.getClientes();
        if (!mounted) return;
        setClientes(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Erro desconhecido");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchClientes();
    return () => {
      mounted = false;
    };
  }, [apiBase]);

  async function handleDelete(id: number | string) {
    if (!confirm("Confirma exclusão deste cliente?")) return;
    try {
      await clienteService.deleteClientes(Number(id));
      setClientes((prev) => prev.filter((c) => String(c.id) !== String(id)));
    } catch (err: any) {
      alert(err?.message || "Erro ao excluir cliente");
    }
  }

  function handleEdit(cliente: Cliente) {
    if (onEdit) return onEdit(cliente);
    window.location.href = `${window.location.origin}/clientes/editar/${cliente.id}`;
  }

  function handleAdd() {
    if (onAdd) return onAdd();
    window.location.href = `${window.location.origin}/clientes/novo`;
  }

  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <h3 style={{ margin: 0 }}>Clientes</h3>
        <div>
          <button
            onClick={handleAdd}
            style={{ padding: "6px 10px", cursor: "pointer" }}
          >
            Novo Cliente
          </button>
        </div>
      </div>

      {loading && <p>Carregando clientes...</p>}
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Nome
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Email
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Telefone
              </th>
              <th
                style={{
                  textAlign: "right",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 12 }}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {clientes.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {c.nome}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {c.email ?? "-"}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {c.telefone ?? "-"}
                </td>
                <td
                  style={{
                    padding: 8,
                    textAlign: "right",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <button
                    onClick={() => handleEdit(c)}
                    style={{ marginRight: 8, cursor: "pointer" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{ cursor: "pointer" }}
                  >
                    Excluir
                  </button>
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
