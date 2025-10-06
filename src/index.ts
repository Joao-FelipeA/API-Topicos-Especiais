import express from "express";
import { Express } from "express";
import routes from "./Routes/index";
import { setupSwagger } from "./swagger";

const app: Express = express();
const port: number = 3001;

app.use(express.json());
setupSwagger(app);
app.use(routes);

const server = app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(`🚀 Servidor rodando em: http://localhost:${address.port}`);
    console.log(`📡 Documentação disponível em: http://localhost:${address.port}/api-docs`);
  }
});
