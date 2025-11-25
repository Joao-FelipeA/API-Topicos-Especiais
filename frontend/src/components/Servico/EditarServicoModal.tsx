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
import type { funcionario } from "../../types/funcionario";

interface EditarServicoModalProps{
    open: boolean;
    onClose: () => void;
    onSave: (id: number, dados: Partial<Servico>) =>Promise<void>;
    servico: Servico | null;
}

export const EditarServicoModal = ({
    open,
    onClose,
    onSave,
    servico,
}: EditarServicoModalProps) => {
    const [saving, setSaving] = useState(false);

    const handleSave = useCallback(async () => {
        if (!servico) return;
        setSaving(true);
        try {
            await onSave(servico.id, {});
        } finally {
            setSaving(false);
        }
    }, [onSave, servico]);

    useEffect(() => {
        // side-effects when modal opens or selected service changes can go here
    }, [open, servico]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                    {servico ? JSON.stringify(servico, null, 2) : "Nenhum serviço selecionado."}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancelar</Button>
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