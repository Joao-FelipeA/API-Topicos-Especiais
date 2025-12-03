import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";

interface CriarClienteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (dados: { nome: string; email?: string; cpf?: string }) => Promise<void>;
}

export function CriarClienteModal({ open, onClose, onSave }: CriarClienteModalProps) {
  const [form, setForm] = useState({ nome: "", email: "", cpf: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.nome.trim()) err.nome = "Nome é obrigatório";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Email inválido";
    if (form.cpf && !/^\d{11}$/.test(form.cpf)) err.cpf = "CPF deve ter 11 dígitos numéricos";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        nome: form.nome.trim(),
        email: form.email.trim() || undefined,
        cpf: form.cpf.trim() || undefined,
      });
      setForm({ nome: "", email: "", cpf: "" });
      onClose();
    } catch (err: any) {
      // exibe erro genérico; a action pai pode lançar para mensagens mais específicas
      setErrors((e) => ({ ...e, global: err?.message ?? "Erro ao criar cliente" }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Criar Cliente</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nome"
            fullWidth
            value={form.nome}
            onChange={handleChange("nome")}
            error={!!errors.nome}
            helperText={errors.nome}
            autoFocus
          />
          <TextField
            label="Email"
            fullWidth
            value={form.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="CPF (apenas números)"
            fullWidth
            value={form.cpf}
            onChange={handleChange("cpf")}
            error={!!errors.cpf}
            helperText={errors.cpf}
          />
          {errors.global && (
            <Box color="error.main" mt={1}>
              {errors.global}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? <CircularProgress size={18} /> : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}