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
import type { Funcionario } from "../../types/funcionario";

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
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string,string>>({});

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
        const schemaKey = name === "clienteId" ? "clienteID" : name === "funcionarioId" ? "funcionarioID" : name;
        try {
            if (typeof validateField === "function") {
                (validateField as any)(createServicoSchema.partial(), schemaKey, value);
            }
            setErrors(prev => ({ ...prev, [name]: "" }));
        } catch (err: any) {
            setErrors(prev => ({ ...prev, [name]: err?.message ?? "Valor inválido" }));
        }
    };

    const handleSelectChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFormData(prev => ({ ...prev, [name]: value }));
        const schemaKey = name === "clienteId" ? "clienteID" : "funcionarioID";
        try {
            if (typeof validateField === "function") {
                (validateField as any)(createServicoSchema.partial(), schemaKey, value);
            }
            setErrors(prev => ({ ...prev, [name]: "" }));
        } catch (err: any) {
            setErrors(prev => ({ ...prev, [name]: err?.message ?? "Valor inválido" }));
        }
    };

const handleSave = useCallback(async () => {
        if (saving) return;
        setSaving(true);
        setErrors({});
        try {
            // bloqueia envio se não selecionou cliente/funcionário
            if (!formData.clienteId || !formData.funcionarioId) {
                setErrors({
                    clienteId: !formData.clienteId ? "Selecione um cliente" : "",
                    funcionarioId: !formData.funcionarioId ? "Selecione um funcionário" : "",
                });
                setSaving(false);
                return;
            }

            const payloadForValidation = {
                motivo: formData.motivo || undefined,
                dta_abertura: formData.dta_abertura ? new Date(formData.dta_abertura).toISOString() : undefined,
                clienteID: formData.clienteId ? Number(formData.clienteId) : undefined,
                funcionarioID: formData.funcionarioId ? Number(formData.funcionarioId) : undefined,
            };

            const parsed = createServicoSchema.partial().safeParse(payloadForValidation);
            if (!parsed.success) {
                const fieldErrors: Record<string,string> = {};
                for (const issue of parsed.error.issues) {
                    const key = issue.path[0] as string;
                    const uiKey = key === "clienteID" ? "clienteId" : key === "funcionarioID" ? "funcionarioId" : key;
                    fieldErrors[uiKey] = issue.message;
                }
                setErrors(fieldErrors);
                setSaving(false);
                return;
            }


            await onSave({
                motivo: formData.motivo,
                // mantemos Date para o onSave (mas no service que chama a API converta para string/ISO se necessário)
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
                            error={!!errors.motivo}
                            helperText={errors.motivo}
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
                            error={!!errors.dta_abertura}
                            helperText={errors.dta_abertura}
                        />
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            label="Cliente"
                            name="clienteId"
                            value={String(formData.clienteId)}
                            onChange={handleSelectChange("clienteId")}
                            error={!!errors.clienteId}
                            helperText={errors.clienteId}
                        >
                            <MenuItem value={0}>Selecione</MenuItem>
                            {clientes.map(c => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.nome}
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
                            error={!!errors.funcionarioId}
                            helperText={errors.funcionarioId}
                        >
                            <MenuItem value={0}>Selecione</MenuItem>
                            {funcionarios.map(f => (
                                <MenuItem key={f.id} value={f.id}>
                                    {f.nome}
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

export default CriarServicoModal;