import React from "react";
import { Box, Typography } from "@mui/material";
import ClienteTable from "../components/Cliente/ClienteTable";

export default function Clientes() {
  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Clientes</Typography>
      </Box>

      <ClienteTable apiBase={"/api/clientes"} />
    </Box>
  );
}
