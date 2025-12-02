import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
    >
      <Paper elevation={3} sx={{ p: 4, width: 480 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Painel
        </Typography>

        <Typography variant="body1" mb={3} textAlign="center">
          Escolha uma opção para continuar.
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <Button variant="contained" onClick={() => navigate("/servicos")}>
            Ver Serviços
          </Button>
          <Button variant="outlined" onClick={() => navigate("/clientes")}>
            Ver Clientes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
