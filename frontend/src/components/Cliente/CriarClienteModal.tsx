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
  onSave: (dados: { nome: string; email?: string; CPF?: string; telefone?: number;}) => Promise<void>;
}

export function CriarClienteModal({ open, onClose, onSave }: CriarClienteModalProps) {
  const [form, setForm] = useState({ nome: "", email: "", CPF: "", telefone: ""});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.nome.trim()) err.nome = "Nome é obrigatório";
    if (!form.email.trim()) err.email = "Email é obrigatório";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Email inválido";
    if (!form.CPF.trim()) err.CPF = "CPF é obrigatório";
    else if (!/^\d{11}$/.test(form.CPF)) err.CPF = "CPF deve ter 11 dígitos numéricos";
    if (!form.telefone.trim()) err.telefone = "Telefone é obrigatório";
    else if (!/^\d{9,}$/.test(form.telefone)) err.telefone = "O telefone tem que ter no mínimo 9 dígitos";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        nome: form.nome.trim(),
        email: form.email.trim(),
        CPF: form.CPF.trim(),
        telefone: Number(form.telefone.trim())
      });
      setForm({ nome: "", email: "", CPF: "", telefone: "" });
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
            required
            value={form.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="CPF (apenas números)"
            fullWidth
            required
            value={form.CPF}
            onChange={handleChange("CPF")}
            error={!!errors.CPF}
            helperText={errors.CPF}
          />
          <TextField
            label="Telefone (apenas números)"
            fullWidth
            required
            value={form.telefone}
            onChange={handleChange("telefone")}
            error={!!errors.telefone}
            helperText={errors.telefone}
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