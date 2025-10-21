import React from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const Home = () => {
  return (
    <Typography variant="h6" component="h1" fontWeight={600} mb={1}>
      {/* variant="h6": tamanho e peso do texto
        component="h1": semântica HTML
        fontWeight={600}: peso da fonte
        mb={1}: margin-bottom de 8px */}
      Sem frontend ainda!
    </Typography>
  );
};

export default Home;
