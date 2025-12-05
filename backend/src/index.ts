import express from "express";
import { Express } from "express";
import cors from "cors";
import routes from "./Routes/index";
import { setupSwagger } from "./swagger";

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173"

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
setupSwagger(app);
app.use(routes);

const server = app.listen(PORT, () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(`🚀 Servidor rodando em: http://localhost:${address.port}`);
    console.log(
      `📡 Documentação disponível em: http://localhost:${address.port}/api-docs`
    );
    console.log(`Cors permitido para: ${CORS_ORIGIN}`);
  }
});
