// ...existing code...
import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { apiFetch } from "../../api";

type Cliente = {
  id?: number | string;
  nome: string;
  email?: string;
  telefone?: string;
};

interface CriarClienteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (novoCliente: Cliente) => void;
}

const INITIAL_FORM = { nome: "", email: "", telefone: "" };

export const CriarClienteModal: React.FC<CriarClienteModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<Cliente>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((p) => ({ ...p, [name]: value }));
      if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
    },
    [errors]
  );

  const validate = useCallback((data: Cliente) => {
    const errs: Record<string, string> = {};
    if (!data.nome || !String(data.nome).trim()) errs.nome = "Nome é obrigatório";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = "Email inválido";
    return { valid: Object.keys(errs).length === 0, errors: errs };
  }, []);

  const handleSave = useCallback(async () => {
    const { valid, errors: vErrors } = validate(form);
    if (!valid) {
      setErrors(vErrors);
      return;
    }

    setSaving(true);
    try {
      const novo = await apiFetch<Cliente>("/clientes", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onSuccess(novo);
      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
    } catch (err: any) {
      console.error("Erro ao criar cliente:", err);
      setErrors((prev) => ({ ...prev, submit: err?.message || "Erro ao criar cliente" }));
    } finally {
      setSaving(false);
    }
  }, [form, validate, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Cadastrar Novo Cliente
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            error={!!errors.nome}
            helperText={errors.nome}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Telefone"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            error={!!errors.telefone}
            helperText={errors.telefone}
          />

          {errors.submit && (
            <Box sx={{ color: "error.main", fontSize: "0.9rem" }}>{errors.submit}</Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={saving}>
          Cancelar
        </Button>

        <Button onClick={handleSave} variant="contained" color="primary" disabled={saving}>
          {saving ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Salvando...
            </>
          ) : (
            "Cadastrar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CriarClienteModal;
// ...existing code...