import { Router } from "express";
import clienteController from "../Controller/ClienteController";

const router = Router();

router.get("/clientes", clienteController.getClientes);
router.get("/clientes/:id", clienteController.getClientesById);
router.post("/clientes", clienteController.createCliente);
router.put("/clientes/:id", clienteController.updateCliente);
router.delete("/clientes/:id", clienteController.deleteCliente);

export default router;