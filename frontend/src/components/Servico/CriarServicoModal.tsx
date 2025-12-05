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
  Alert,
} from "@mui/material";
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
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSave = useCallback(async () => {
        if (saving) return;
        setSaving(true);
        setErrors({});
        try {
            // valida campos obrigatórios
            if (!formData.clienteId || formData.clienteId === 0) {
                setErrors(prev => ({ ...prev, clienteId: "Selecione um cliente" }));
                setSaving(false);
                return;
            }
            if (!formData.funcionarioId || formData.funcionarioId === 0) {
                setErrors(prev => ({ ...prev, funcionarioId: "Selecione um funcionário" }));
                setSaving(false);
                return;
            }
            if (!formData.motivo || formData.motivo.trim() === "") {
                setErrors(prev => ({ ...prev, motivo: "Motivo é obrigatório" }));
                setSaving(false);
                return;
            }

            // converte data para ISO 8601 string
            const dtaAbertura = formData.dta_abertura 
                ? new Date(formData.dta_abertura).toISOString() 
                : new Date().toISOString();

            // payload para log/debug
            const payload = {
                motivo: formData.motivo.trim(),
                dta_abertura: dtaAbertura,
                clienteId: Number(formData.clienteId),
                funcionarioId: Number(formData.funcionarioId),
            };
            console.log("📤 Payload enviado para POST /servicos:", payload);

            await onSave({
                motivo: payload.motivo,
                dta_abertura: new Date(payload.dta_abertura),
                clienteId: payload.clienteId,
                funcionarioId: payload.funcionarioId,
            });

            // reseta form ao salvar com sucesso
            setFormData({
                dta_abertura: "",
                motivo: "",
                clienteId: 0,
                funcionarioId: 0,
            });
            onClose();
        } catch (err: any) {
            console.error("❌ Erro ao criar serviço:", err);
            // captura resposta do servidor se existir
            if (err?.response?.data) {
                console.error("📥 Resposta do servidor:", err.response.data);
                // mapeia erros do backend para o form
                if (typeof err.response.data === "object") {
                    const fieldErrors: Record<string,string> = {};
                    for (const key of Object.keys(err.response.data)) {
                        fieldErrors[key] = String(err.response.data[key]);
                    }
                    setErrors(fieldErrors);
                } else if (typeof err.response.data === "string") {
                    setErrors({ geral: err.response.data });
                }
            } else {
                setErrors({ geral: err.message || "Erro ao criar serviço" });
            }
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
                        {errors.geral && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errors.geral}
                            </Alert>
                        )}
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