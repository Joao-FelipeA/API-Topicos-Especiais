import express from "express";
import { Express } from "express";
import cors from "cors";
import routes from "./Routes/index";
import { setupSwagger } from "./swagger";

const app: Express = express();
const port: number = 3001;

app.use(express.json());
// Habilitar CORS para desenvolvimento (ajuste em produção)
app.use(
  cors({
    origin: (origin, callback) => {
      // permitir todas as origens para dev; em produção especifique a(s) origem(ões)
      callback(null, true);
    },
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
setupSwagger(app);
app.use(routes);

const server = app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(`🚀 Servidor rodando em: http://localhost:${address.port}`);
    console.log(
      `📡 Documentação disponível em: http://localhost:${address.port}/api-docs`
    );
  }
});
