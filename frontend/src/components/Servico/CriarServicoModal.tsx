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
import { createServicoSchema } from "../../schemas/servicoSchema";
import { validateField } from "../../schemas/validation";
import { getClientes } from "../../services/clienteService";
import { getFuncionarios } from "../../services/funcionarioService";
import type { Cliente } from "../../types/cliente";
import type { funcionario } from "../../types/funcionario";

interface CriarServicoModalProps{
    open: boolean;
    onClose: ()=>void;
    onSave: (dados:{
        motivo: string;
        dta_abertura: Date;
        clienteId: number;
        funcionarioId: number;
    }) => Promise<void>;
}

export const CriarServicoModal = ({
    open,
    onClose,
    onSave,
}: CriarServicoModalProps) => {
    const [formData, setFormData] = useState({
        dta_abertura: "",
        motivo: "",
        clienteId: 0,
        funcionarioId: 0,
    });

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [funcionarios, setFuncionarios] = useState<funcionario[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        Promise.all([getClientes(), getFuncionarios()])
            .then(([c, f]) => {
                if (!mounted) return;
                setClientes(c);
                setFuncionarios(f);
            })
            .catch(() => {
                /* ignore load errors for now */
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = useCallback(async () => {
        if (saving) return;
        setSaving(true);
        try {
            await onSave({
                motivo: formData.motivo,
                dta_abertura: formData.dta_abertura ? new Date(formData.dta_abertura) : new Date(),
                clienteId: Number(formData.clienteId),
                funcionarioId: Number(formData.funcionarioId),
            });
            onClose();
        } finally {
            setSaving(false);
        }
    }, [formData, onSave, onClose, saving]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Criar Serviço</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" py={2}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Motivo"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Data de Abertura"
                            name="dta_abertura"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData.dta_abertura}
                            onChange={handleChange}
                        />
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            label="Cliente"
                            name="clienteId"
                            value={String(formData.clienteId)}
                            onChange={handleSelectChange("clienteId")}
                        >
                            <MenuItem value={0}>Selecione</MenuItem>
                            {clientes.map(c => (
                                <MenuItem key={(c as any).id} value={(c as any).id}>
                                    {(c as any).nome}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            label="Funcionário"
                            name="funcionarioId"
                            value={String(formData.funcionarioId)}
                            onChange={handleSelectChange("funcionarioId")}
                        >
                            <MenuItem value={0}>Selecione</MenuItem>
                            {funcionarios.map(f => (
                                <MenuItem key={(f as any).id} value={(f as any).id}>
                                    {(f as any).nome}
                                </MenuItem>
                            ))}
                        </TextField>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancelar</Button>
                <Button onClick={handleSave} color="primary" disabled={saving}>
                    {saving ? <CircularProgress size={20} /> : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}