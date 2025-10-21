import { Router } from "express";
import clienteRoutes from "./ClienteRoute";
import funcionarioRoutes from "./FuncionarioRoute";
import servicoRoutes from "./ServicoRoute";

const routes = Router();

routes.use(clienteRoutes);
routes.use(funcionarioRoutes);
routes.use(servicoRoutes);

export default routes;
