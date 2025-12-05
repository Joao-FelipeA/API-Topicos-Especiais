import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { updateServicoSchema } from "../../schemas/servicoSchema";
import { validateField } from "../../schemas/validation";
import { getClientes } from "../../services/clienteService";
import { getFuncionarios } from "../../services/funcionarioService";
import type { Servico } from "../../types/servico";
import type { Cliente } from "../../types/cliente";
import type { Funcionario } from "../../types/funcionario";

interface EditarServicoModalProps{
    open: boolean;
    onClose: () => void;
    onSave: (id: number, dados: Partial<Servico>) =>Promise<void>;
    servico: Servico | null;
}

const toInputDateTime = (iso?: string | Date | null) => {
  if (!iso) return "";
  const d = iso instanceof Date ? iso : new Date(iso);
  const tzOffset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  return local;
};

const toIsoDateTime = (local?: string): Date | null => {
  if (!local) return null;
  return new Date(local);
};

export const EditarServicoModal = ({
  open,
  onClose,
  onSave,
  servico,
}: EditarServicoModalProps) => {
  const [saving, setSaving] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [form, setForm] = useState({
    status: "",
    valor_total: "",
    clienteId: "",
    funcionarioId: "",
    dta_conclusao: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const c = await getClientes();
        setClientes(c);
      } catch {
        setClientes([]);
      }
      try {
        const f = await getFuncionarios();
        setFuncionarios(f);
      } catch {
        setFuncionarios([]);
      }
    };
    if (open) loadOptions();
  }, [open]);

  useEffect(() => {
    if (servico) {
      setForm({
        status: servico.status ?? "",
        valor_total: String(servico.valor_total ?? ""),
        clienteId: String(servico.cliente?.id ?? ""),
        funcionarioId: String(servico.funcionario?.id ?? ""),
        dta_conclusao: toInputDateTime(servico.dta_conclusao ?? undefined),
      });
      setErrors({});
    } else {
      setForm({
        status: "",
        valor_total: "",
        clienteId: "",
        funcionarioId: "",
        dta_conclusao: "",
      });
      setErrors({});
    }
  }, [servico, open]);

  const handleChange = (field: string, value: string) => {
    setForm((s) => ({ ...s, [field]: value }));
    try {
      if (typeof validateField === "function") {
        try {
          (validateField as any)(updateServicoSchema, field, value);
        } catch {}
      }
      setErrors((e) => ({ ...e, [field]: "" }));
    } catch {
      // noop
    }
  };

  const handleSave = useCallback(async () => {
    if (!servico) return;
    setSaving(true);
    setErrors({});
    try {
      const payload: Partial<Servico> = {
        status: form.status || undefined,
        valor_total:
          form.valor_total !== ""
            ? (parseFloat(form.valor_total) as unknown as any)
            : undefined,
        cliente: form.clienteId ? ({ id: Number(form.clienteId) } as Cliente) : undefined,
        funcionario: form.funcionarioId ? ({ id: Number(form.funcionarioId) } as Funcionario) : undefined,
        dta_conclusao: form.dta_conclusao
          ? toIsoDateTime(form.dta_conclusao) ?? undefined
          : undefined,
      };

      const parsed = updateServicoSchema.partial().safeParse(payload);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const path = issue.path.join(".");
          fieldErrors[path] = issue.message;
        }
        setErrors(fieldErrors);
        setSaving(false);
        return;
      }

      await onSave(servico.id, payload);
      onClose();
    } catch (err: any) {
      setErrors((e) => ({ ...e, global: err?.message ?? "Erro ao salvar" }));
    } finally {
      setSaving(false);
    }
  }, [onSave, servico, form, onClose]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Serviço</DialogTitle>
      <DialogContent dividers>
        {!servico ? (
          <Box>Nenhum serviço selecionado.</Box>
        ) : (
          <Box>
            <Box display="flex" flexWrap="wrap" gap={16} sx={{ mt: 1 }}>
              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  error={!!errors.status}
                  helperText={errors.status}
                >
                  <MenuItem value="em aberto">em aberto</MenuItem>
                  <MenuItem value="em_andamento">em_andamento</MenuItem>
                  <MenuItem value="concluido">concluido</MenuItem>
                  <MenuItem value="cancelado">cancelado</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  label="Valor total"
                  type="number"
                  fullWidth
                  value={form.valor_total}
                  onChange={(e) => handleChange("valor_total", e.target.value)}
                  error={!!errors.valor_total}
                  helperText={errors.valor_total}
                />
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  label="Cliente"
                  select
                  fullWidth
                  value={form.clienteId}
                  onChange={(e) => handleChange("clienteId", e.target.value)}
                  error={!!errors.clienteId}
                  helperText={errors.clienteId}
                >
                  {clientes.map((c) => (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.id} - {c.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  label="Funcionário"
                  select
                  fullWidth
                  value={form.funcionarioId}
                  onChange={(e) => handleChange("funcionarioId", e.target.value)}
                  error={!!errors.funcionarioId}
                  helperText={errors.funcionarioId}
                >
                  {funcionarios.map((f) => (
                    <MenuItem key={f.id} value={String(f.id)}>
                      {f.id} - {f.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  label="Data de abertura"
                  fullWidth
                  value={toInputDateTime(servico.dta_abertura ?? undefined)}
                  InputProps={{ readOnly: true }}
                />
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  label="Data de conclusão"
                  type="datetime-local"
                  fullWidth
                  value={form.dta_conclusao}
                  onChange={(e) => handleChange("dta_conclusao", e.target.value)}
                  error={!!errors.dta_conclusao}
                  helperText={errors.dta_conclusao}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <Box component="pre" sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace", background: "#f5f5f5", padding: 1, borderRadius: 1 }}>
                  {/* {JSON.stringify(servico, null, 2)} */}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!servico || saving}
          startIcon={saving ? <CircularProgress size={16} /> : null}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarServicoModal;
