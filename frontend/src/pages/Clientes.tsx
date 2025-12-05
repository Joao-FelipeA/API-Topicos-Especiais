import { useCallback, useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ClienteTableOriginal from "../components/Cliente/ClienteTable";
const ClienteTable = ClienteTableOriginal as any;
import { CriarClienteModal } from "../components/Cliente/CriarClienteModal";
import clienteService from "../services/clienteService";
import type { Cliente } from "../types/cliente";

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCriar, setOpenCriar] = useState(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clienteService.getClientes();
      setClientes(data);
    } catch (err: any) {
      console.error("Erro ao buscar clientes:", err);
      setError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleAbrirCriar = () => setOpenCriar(true);
  const handleFecharCriar = () => setOpenCriar(false);

  const handleCriarSalvar = async (dados: { nome: string; email: string; CPF: string; telefone: number }) => {
    try {
      const payload: Omit<Cliente, "id"> = {
        nome: dados.nome,
        email: dados.email,
        CPF: dados.CPF,
        telefone: dados.telefone
      };
      await clienteService.createClientes(payload);
      await fetchClientes();
      handleFecharCriar();
    } catch (err) {
      console.error("Erro ao criar cliente:", err);
      throw err;
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate(-1)} aria-label="voltar" size="large">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ ml: 1 }}>
            Clientes
          </Typography>
        </Box>

        <Box>
          <Button variant="contained" onClick={handleAbrirCriar}>
            Novo Cliente
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={fetchClientes}>Tentar novamente</Button>
        </Box>
      ) : (
        <ClienteTable clientes={clientes} onRefresh={fetchClientes} />
      )}

      <CriarClienteModal open={openCriar} onClose={handleFecharCriar} onSave={handleCriarSalvar} />
    </Box>
  );
}