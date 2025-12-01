import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

interface LoginResponse {
  message: string;
  token?: string;
  user?: Funcionario;
}

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
    setFuncionario(null);

    try {
      // Backend espera o campo 'senha' e retorna { message, token, user }
      const response = await axios.post<LoginResponse>(API_ENDPOINTS.LOGIN, {
        email,
        senha,
      });

      const data = response.data;

      // salvar token (se houver) e setar header global do axios
      if (data.token) {
        try {
          localStorage.setItem("token", data.token);
        } catch (e) {
          console.warn("Não foi possível salvar token no localStorage", e);
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }

      if (data.user) {
        setFuncionario(data.user);
        try {
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (e) {
          console.warn("Não foi possível salvar usuário no localStorage", e);
        }
        navigate("/");
      } else {
        console.log("sem dados", data);
        if (data.token) navigate("/");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(
            error.response.data?.message || `Erro ${error.response.status}`
          );
        } else if (error.request) {
          setError("Servidor não respondeu");
        } else {
          setError(`Erro na requisição: ${error.message}`);
        }
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={480} mx="auto" mt={6} p={3} boxShadow={2} borderRadius={1}>
      <Typography variant="h5" mb={2}>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
        />
        <TextField
          label="Senha"
          fullWidth
          margin="normal"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Button variant="outlined" onClick={() => navigate("/")}>
            Voltar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Entrar"}
          </Button>
        </Box>
      </form>

      {funcionario && (
        <Box
          mt={3}
          p={2}
          sx={{
            background: "#fafafa",
            borderRadius: 1,
            border: "1px solid #ddd",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="success.main"
          >
            Login realizado com sucesso!
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>ID:</strong> {funcionario.id}
          </Typography>
          <Typography variant="body2">
            <strong>Nome:</strong> {funcionario.nome}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {funcionario.email ?? "—"}
          </Typography>
          <Typography variant="body2">
            <strong>Especialidade:</strong> {funcionario.especialidade ?? "—"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
