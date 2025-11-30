import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../services/loginService";

interface Funcionario {
  id: number;
  nome: string;
  telefone?: string;
  email?: string;
  especialidade?: string;
  CPF?: string;
  [key: string]: any;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:3333/login",
        {
          email,
          password,
        }
      );

      // Axios automaticamente trata HTTP 200-299 como sucesso
      const data = response.data;
      setSuccess(data.message || "Login realizado com sucesso!");
    } catch (error) {
      // Axios automaticamente trata códigos de erro como exceção
      if (axios.isAxiosError(error)) {
        // Erro HTTP (400, 401, 403, 500, etc.)
        const errorMessage =
          error.response?.data?.message ||
          `Erro ${error.response?.status}: ${error.response?.statusText}`;
        setError(errorMessage);
      } else {
        // Erro de rede ou outros
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro de conexão. Verifique se o servidor está rodando.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={480} mx="auto" mt={6} p={3} boxShadow={2} borderRadius={1}>
      <Typography variant="h5" mb={2}>Login</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          label="Senha"
          fullWidth
          margin="normal"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
        />

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={() => navigate("/")}>Voltar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Entrar"}
          </Button>
        </Box>
      </form>

      {funcionario && (
        <Box mt={3} p={2} sx={{ background: "#fafafa", borderRadius: 1 }}>
          <Typography variant="subtitle1">Funcionário autenticado:</Typography>
          <Typography>ID: {funcionario.id}</Typography>
          <Typography>Nome: {funcionario.nome}</Typography>
          <Typography>Email: {funcionario.email ?? "—"}</Typography>
          <Typography>Telefone: {funcionario.telefone ?? "—"}</Typography>
          <Typography>Especialidade: {funcionario.especialidade ?? "—"}</Typography>
          <Typography>CPF: {funcionario.CPF ?? "—"}</Typography>
        </Box>
      )}
    </Box>
  );
}