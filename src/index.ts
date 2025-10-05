import express from "express";
import { Express } from "express";
import clienteRoutes from "./Routes/ClienteRoute";
import funcionarioRoutes from "./Routes/FuncionarioRoute";
import servicoRoutes from "./Routes/ServicoRoute";

const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use(clienteRoutes, funcionarioRoutes, servicoRoutes);

app.listen(port, () => {
    console.log(`A API subiu na porta ${port}`)
})