// ...existing code...
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  Checkbox,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CriarServicoModal from "../components/Servico/CriarServicoModal";
import EditarServicoModal from "../components/Servico/EditarServicoModal";
import * as servicoService from "../services/servicoService";
import type { Funcionario } from "../types/funcionario";
import type { Cliente } from "../types/cliente";
import type { Servico } from "../types/servico";


type ServicoPayload = {
  motivo: string;
  dta_abertura: string;
  clienteId: number;
  funcionarioID: number;
  status?: string | undefined;
  valor_total?: number | undefined;
  dta_conclusao?: string | undefined;
};

export function Servicos() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openCriar, setOpenCriar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);

  // selecionados em lote
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const fetchServicos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicoService.getServicos();
      const normalized = data.map((d: any) => ({
        ...d,
        motivo: d.motivo ?? "",
      }));
      setServicos(normalized as Servico[]);
      setSelectedIds(new Set()); // limpar seleção ao recarregar
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
      setError("Não foi possível carregar a lista de serviços. Verifique o servidor backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServicos();
  }, [fetchServicos]);

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
      clienteId: Number(dados.clienteId),
      funcionarioID: Number(dados.funcionarioId),
    };
    await servicoService.createServico(payload);
    await fetchServicos();
  };

  const handleEditarSalvar = async (id: number, dados: Partial<Servico>) => {
    const toNumber = (v: any): number | undefined => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "number") return v;
      if (typeof v === "string") {
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
      }
      if (Array.isArray(v) && v.length > 0) {
        const n = Number(v[0]);
        return Number.isFinite(n) ? n : undefined;
      }
      if (ArrayBuffer.isView(v) && (v as any).length > 0) {
        const n = Number((v as any)[0]);
        return Number.isFinite(n) ? n : undefined;
      }
      return undefined;
    };

    const payload: Partial<ServicoPayload> = {
      status: dados.status,
      valor_total: toNumber(dados.valor_total),
      clienteId: dados.cliente ? Number((dados.cliente as Cliente).id) : undefined,
      funcionarioID: dados.funcionario ? Number((dados.funcionario as Funcionario).id) : undefined,
    };

    if (dados.dta_conclusao !== undefined && dados.dta_conclusao !== null) {
      payload.dta_conclusao =
        typeof dados.dta_conclusao === "string"
          ? dados.dta_conclusao
          : (dados.dta_conclusao as Date).toISOString();
    }

    await servicoService.updateServico(id, payload);
    await fetchServicos();
  };

  
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllOnPage = () => {
  
    setSelectedIds(new Set(servicos.map((s) => s.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  
  const handleBulkComplete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Marcar ${selectedIds.size} serviço(s) como concluído?`)) return;
    try {
      const ids = Array.from(selectedIds);
      await Promise.all(
        ids.map((id) =>
          servicoService.updateServico(id, {
            status: "concluido",
            dta_conclusao: new Date().toISOString(),
          })
        )
      );
      await fetchServicos();
    } catch (err) {
      console.error("Erro ao marcar concluído:", err);
      alert("Erro ao concluir serviços.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Excluir ${selectedIds.size} serviço(s)? Esta ação é irreversível.`)) return;
    try {
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map((id) => servicoService.deleteServico(id)));
      await fetchServicos();
    } catch (err) {
      console.error("Erro ao excluir serviços:", err);
      alert("Erro ao excluir serviços.");
    }
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
          <Button variant="contained" onClick={fetchServicos}>
            Tentar novamente
          </Button>
        </Box>
      </Box>
    );
  }

  const anySelected = selectedIds.size > 0;
  const allSelected = servicos.length > 0 && selectedIds.size === servicos.length;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate(-1)} aria-label="voltar" size="large">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ ml: 1 }}>
            Lista de Serviços
          </Typography>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <Tooltip title="Selecionar todos">
            <Checkbox
              checked={allSelected}
              indeterminate={anySelected && !allSelected}
              onChange={() => (allSelected ? clearSelection() : selectAllOnPage())}
              inputProps={{ "aria-label": "selecionar todos" }}
            />
          </Tooltip>

          <Button variant="outlined" onClick={handleBulkComplete} disabled={!anySelected}>
            Marcar como concluído ({selectedIds.size})
          </Button>
          <Button variant="outlined" color="error" onClick={handleBulkDelete} disabled={!anySelected}>
            Excluir ({selectedIds.size})
          </Button>

          <Button variant="contained" onClick={handleAbrirCriar}>
            Novo Serviço
          </Button>
        </Box>
      </Box>

      {servicos.length === 0 ? (
        <Typography>Nenhum serviço encontrado no momento.</Typography>
      ) : (
        <Box component={Paper} p={2}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f4f4f4" }}>
              <tr>
                <th style={{ padding: "8px", textAlign: "left" }}></th>
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
              {servicos.map((s) => {
                const checked = selectedIds.has(s.id);
                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px", width: 48 }}>
                      <Checkbox
                        size="small"
                        checked={checked}
                        onChange={() => toggleSelect(s.id)}
                        inputProps={{ "aria-label": `selecionar-servico-${s.id}` }}
                      />
                    </td>
                    <td style={{ padding: "8px" }}>{s.id}</td>
                    <td style={{ padding: "8px" }}>{s.status}</td>
                    <td style={{ padding: "8px" }}>
                      {new Date(s.dta_abertura).toLocaleString()}
                    </td>
                    <td style={{ padding: "8px", textAlign: "right" }}>
                      R$ {Number(s.valor_total ?? 0).toFixed(2)}
                    </td>
                    <td style={{ padding: "8px" }}>{s.cliente?.nome ?? "—"}</td>
                    <td style={{ padding: "8px" }}>
                      {s.funcionario ? `${s.funcionario.nome} (${s.funcionario.especialidade ?? "—"})` : "—"}
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <Button size="small" variant="outlined" onClick={() => handleAbrirEditar(s)}>
                        Editar
                      </Button>
                    </td>
                  </tr>
                );
              })}
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
