import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, CircularProgress, Typography, Paper } from "@mui/material";
import CriarServicoModal from "../Servico/CriarServicoModal";
import EditarServicoModal from "../Servico/EditarServicoModal";
import servicoService, { type ServicoPayload} from "../../services/servicoService";
import clienteService from "../../services/clienteService";
import * as funcionarioService from "../../services/funcionarioService";
import type { Servico } from "../../types/servico";


interface Cliente {
  id: number;
  nome: string;
  email?: string;
}
interface Funcionario {
  id: number;
  nome: string;
  especialidade?: string;
}



export function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clientesMap, setClientesMap] = useState<Record<number, Cliente>>({});
  const [funcionariosMap, setFuncionariosMap] = useState<Record<number, Funcionario>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openCriar, setOpenCriar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [servicosData, clientesData, funcionariosData] = await Promise.all([
        servicoService.getServicos(),
        clienteService.getClientes(),
        funcionarioService.getFuncionarios(),
      ]);

      setServicos(servicosData);

      const cMap: Record<number, Cliente> = {};
      clientesData.forEach((c: Cliente) => (cMap[c.id] = c));
      setClientesMap(cMap);

      const fMap: Record<number, Funcionario> = {};
      funcionariosData.forEach((f: Funcionario) => (fMap[f.id] = f));
      setFuncionariosMap(fMap);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados. Verifique o servidor backend.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAbrirCriar = () => setOpenCriar(true);
  const handleFecharCriar = () => setOpenCriar(false);

  const handleAbrirEditar = (servico: Servico) => {
    setServicoSelecionado(servico);
    setOpenEditar(true);
  };
  const handleFecharEditar = () => {
    setServicoSelecionado(null);
    setOpenEditar(false);
  };

  const handleCriarSalvar = async (dados: {
    motivo: string;
    dta_abertura: Date;
    clienteId: number;
    funcionarioId: number;
  }) => {
    const payload: ServicoPayload = {
      motivo: dados.motivo,
      dta_abertura: dados.dta_abertura.toISOString(),
      clienteID: Number(dados.clienteId),
      funcionarioID: Number(dados.funcionarioId),
    };
    await servicoService.createServico(payload);
    await fetchAll();
  };

  const handleEditarSalvar = async (id: number, dados: Partial<Servico>) => {
    // normalize valor_total to a number or undefined to satisfy ServicoPayload.valor_total
    const valorTotal: number | undefined = (() => {
      const v = (dados as any).valor_total;
      if (v === null || v === undefined) return undefined;
      if (typeof v === "number") return v;
      // handle array-like values (e.g. Float32Array) by taking the first element
      if (Array.isArray(v)) return Number(v[0]);
      if (ArrayBuffer.isView(v)) return Number((v as any)[0]);
      const parsed = Number(v);
      return Number.isNaN(parsed) ? undefined : parsed;
    })();

    const payload: Partial<ServicoPayload> = {
      status: dados.status,
      valor_total: valorTotal,
      clienteID: (() => {
        const c = (dados as any).cliente;
        if (c === null || c === undefined) return undefined;
        if (typeof c === "number") return c;
        if (typeof c === "object" && "id" in c) return Number((c as any).id);
        const parsed = Number(c);
        return Number.isNaN(parsed) ? undefined : parsed;
      })(),
      funcionarioID: (() => {
        const f = (dados as any).funcionario;
        if (f === null || f === undefined) return undefined;
        if (typeof f === "number") return f;
        if (typeof f === "object" && "id" in f) return Number((f as any).id);
        const parsed = Number(f);
        return Number.isNaN(parsed) ? undefined : parsed;
      })(),
      dta_conclusao: (() => {
        const dc = (dados as any).dta_conclusao;
        if (dc === null || dc === undefined) return undefined;
        if (typeof dc === "string") return dc;
        return new Date(dc).toISOString();
      })(),
    };
    await servicoService.updateServico(id, payload);
    await fetchAll();
  };

  if (loading) {
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Carregando serviços...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              setError(null);
              fetchAll();
            }}
          >
            Tentar novamente
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Lista de Serviços</Typography>
        <Button variant="contained" onClick={handleAbrirCriar}>
          Novo Serviço
        </Button>
      </Box>

      {servicos.length === 0 ? (
        <Typography>Nenhum serviço encontrado no momento.</Typography>
      ) : (
        <Box component={Paper} p={2}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f4f4f4" }}>
              <tr>
                <th style={{ padding: "8px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Data Abertura</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Valor</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Cliente</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Funcionário</th>
                <th style={{ padding: "8px", textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px" }}>{s.id}</td>
                  <td style={{ padding: "8px" }}>{s.status}</td>
                  <td style={{ padding: "8px" }}>
                    {new Date(s.dta_abertura).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    R$ {Number(s.valor_total ?? 0).toFixed(2)}
                  </td>

                  {/* usar dados do cliente vindo do clienteService */}
                  <td style={{ padding: "8px" }}>
                    { (s.cliente && clientesMap[s.cliente.id])
                        ? clientesMap[s.cliente.id].nome
                        : "—"
                    }
                  </td>

                  <td style={{ padding: "8px" }}>
                    { (s.funcionario && funcionariosMap[s.funcionario.id])
                        ? `${funcionariosMap[s.funcionario.id].nome} (${funcionariosMap[s.funcionario.id].especialidade ?? "—"})`
                        : "—"
                    }
                  </td>

                  {/* usar dados do funcionario vindo do funcionarioService */}
                  <td style={{ padding: "8px" }}>
                    {s.funcionarioID && funcionariosMap[s.funcionarioID]
                      ? `${funcionariosMap[s.funcionarioID].nome} (${funcionariosMap[s.funcionarioID].especialidade ?? "—"})`
                      : "—"}
                  </td>

                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <Button size="small" variant="outlined" onClick={() => handleAbrirEditar(s)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}

      <CriarServicoModal open={openCriar} onClose={handleFecharCriar} onSave={handleCriarSalvar} />

      <EditarServicoModal
        open={openEditar}
        onClose={handleFecharEditar}
        servico={servicoSelecionado}
        onSave={handleEditarSalvar}
      />
    </Box>
  );
}