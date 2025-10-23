import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { z } from "zod";
import axios from "axios";

const emailSchema = z.email();
const passwordSchema = z.string().min(4);

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    nome: string;
    email: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    if (!email.trim()) return { isValid: false, error: "" };
    const result = emailSchema.safeParse(email);
    return {
      isValid: result.success,
      error: result.success ? "" : "Email inválido",
    };
  };

  const validatePassword = (password: string) => {
    if (!password) return { isValid: false, error: "" };
    const result = passwordSchema.safeParse(password);
    return {
      isValid: result.success,
      error: result.success ? "" : "A senha deve ter pelo menos 4 caracteres",
    };
  };

  const isFormValid =
    validateEmail(email).isValid && validatePassword(password).isValid;

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError("");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError("");
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isFormValid) {
      setError("Por favor, preencha todos os campos corretamente");
      return;
    }

    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper elevation={2} sx={{ p: 3, width: 320 }}>
        <Box textAlign="center" mb={2}>
          <LoginIcon sx={{ fontSize: 36, color: "primary.main", mb: 1 }} />
          <Typography variant="h6" component="h1" fontWeight={600} mb={1}>
            Bem-vindo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Faça login para acessar o sistema
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleEmailChange}
            error={email.length > 0 && !validateEmail(email).isValid}
            helperText={validateEmail(email).error}
            disabled={isLoading}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
            error={password.length > 0 && !validatePassword(password).isValid}
            helperText={validatePassword(password).error}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isFormValid || isLoading}
            sx={{
              mt: 2,
              opacity: isFormValid && !isLoading ? 1 : 0.6,
              cursor: isFormValid && !isLoading ? "pointer" : "not-allowed",
            }}
          >
            {isLoading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                <span>Entrando...</span>
              </Box>
            ) : (
              "Entrar"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;