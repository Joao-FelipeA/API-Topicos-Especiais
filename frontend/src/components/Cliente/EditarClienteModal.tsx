import { useState, useEffect, useCallback } from "react";
// Certifique-se que o caminho do tipo está correto
import type { Cliente } from "../../types/cliente"; 
import { updateClientes } from "../../services/clienteService";
import { validateUpdateCliente } from "../../schemas/validation";
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

interface EditarClienteModalProps {
  open: boolean;
  cliente: Cliente | null;
  onClose: () => void;
  onSave: (clienteAtualizado: Cliente) => void;
}

export const EditarClienteModal = ({
  open,
  cliente, // Recebendo o cliente
  onClose,
  onSave,
}: EditarClienteModalProps) => {
  
  const INITIAL_FORM_DATA: Cliente = {
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
  };

  const [formData, setFormData] = useState<Cliente>(INITIAL_FORM_DATA);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

useEffect(() => {
  if (open && cliente) {
    setFormData({
        id: cliente.id,
        nome: cliente.nome || "",
        email: cliente.email || "",
        cpf: cliente.cpf || "",
        telefone: cliente.telefone || "",
      });
      setErrors({}); 
    }
  }, [open, cliente]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    const validation = validateUpdateCliente(formData);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setSalvando(true);
    try {
      await updateClientes(validation.data.id, validation.data);
      
      onSave(validation.data);
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setErrors({ submit: "Erro ao salvar cliente. Tente novamente." });
    } finally {
      setSalvando(false);
    }
  }, [formData, onSave, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Editar Cliente
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          
          {/* Exibindo erro geral de envio, se houver */}
          {errors.submit && (
             <Box color="error.main" mb={1}>{errors.submit}</Box>
          )}

          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Digite o nome completo"
            error={!!errors.nome}
            helperText={errors.nome}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Digite o email"
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            placeholder="Digite o CPF"
            error={!!errors.cpf}
            helperText={errors.cpf}
          />

          <TextField
            fullWidth
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            placeholder="Digite o telefone"
            error={!!errors.telefone}
            helperText={errors.telefone}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={salvando}>
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={salvando}
        >
          {salvando ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarClienteModal;