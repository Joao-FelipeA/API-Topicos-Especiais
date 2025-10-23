// Importa o React e o hook useState para manipular estados locais
import React, { useState } from "react";
// Importa componentes de UI prontos do Material-UI
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
// Importa o ícone de login do Material-UI Icons
import { Login as LoginIcon } from "@mui/icons-material";

// Define o componente funcional Login
const Login: React.FC = () => {
  // Cria o estado 'email' e a função para atualizá-lo
  const [email, setEmail] = useState("");
  // Cria o estado 'password' e a função para atualizá-lo
  const [password, setPassword] = useState("");

  // Função chamada ao submeter o formulário
  const handleLogin = () => {
    // Aqui você pode implementar a chamada para a API de login
    // Por enquanto, apenas imprime os valores no console
    console.log("Login attempt:", { email, password });
  };

  // Renderiza o JSX do componente
  return (
    // Box do MUI: container flex para centralizar o conteúdo na tela
    <Box
      display="flex" // display="flex": ativa o flexbox para o container
      justifyContent="center" // justifyContent="center": centraliza horizontalmente
      alignItems="center" // alignItems="center": centraliza verticalmente
      minHeight="80vh" // minHeight="80vh": altura mínima de 80% da viewport
    >
      {/* Paper do MUI: cartão com sombra e padding */}
      <Paper elevation={2} sx={{ p: 3, width: 320 }}>
        {/* elevation={2}: define a intensidade da sombra
            sx={{ p: 3, width: 320 }}: padding de 24px e largura fixa de 320px */}
        {/* Box para o cabeçalho do formulário */}
        <Box textAlign="center" mb={2}>
          {/* textAlign="center": centraliza o texto
              mb={2}: margin-bottom de 16px */}
          {/* Ícone de login centralizado */}
          <LoginIcon sx={{ fontSize: 36, color: "primary.main", mb: 1 }} />
          {/* fontSize: tamanho do ícone
              color: cor primária do tema
              mb: margin-bottom de 8px */}
          {/* Título principal */}
          <Typography variant="h6" component="h1" fontWeight={600} mb={1}>
            {/* variant="h6": tamanho e peso do texto
                component="h1": semântica HTML
                fontWeight={600}: peso da fonte
                mb={1}: margin-bottom de 8px */}
            Bem-vindo
          </Typography>
          {/* Subtítulo */}
          <Typography variant="body2" color="text.secondary">
            {/* variant="body2": texto menor
                color="text.secondary": cor secundária do tema */}
            Faça login para acessar o sistema
          </Typography>
        </Box>
        {/* Formulário de login */}
        <Box
          component="form" // component="form": transforma o Box em um <form>
          noValidate // noValidate: desabilita validação nativa do navegador
          onSubmit={(e) => {
            e.preventDefault(); // Evita recarregar a página ao enviar
            handleLogin(); // Chama a função de login
          }}
        >
          {/* Campo de texto para email */}
          <TextField
            label="Email" // label: texto exibido acima do campo
            type="email" // type: tipo do input (email)
            fullWidth // fullWidth: ocupa toda a largura do container
            margin="normal" // margin: espaçamento vertical padrão
            value={email} // value: valor do campo controlado pelo estado
            onChange={(e) => setEmail(e.target.value)} // onChange: atualiza o estado ao digitar
          />
          {/* Campo de texto para senha */}
          <TextField
            label="Senha" // label: texto exibido acima do campo
            type="password" // type: tipo do input (senha oculta)
            fullWidth // fullWidth: ocupa toda a largura do container
            margin="normal" // margin: espaçamento vertical padrão
            value={password} // value: valor do campo controlado pelo estado
            onChange={(e) => setPassword(e.target.value)} // onChange: atualiza o estado ao digitar
          />
          {/* Botão de envio do formulário */}
          <Button
            type="submit" // type: submit para enviar o formulário
            variant="contained" // variant: botão preenchido
            color="primary" // color: cor primária do tema
            fullWidth // fullWidth: ocupa toda a largura do container
            sx={{ mt: 2 }} // sx: margin-top de 16px
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// Exporta o componente para ser usado em outros arquivos
export default Login;