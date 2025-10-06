import express from "express";
import { Express } from "express";
import routes from "./Routes/index"

const app: Express = express();
const port: number = 3001;

app.use(express.json());
app.use(routes);


const server = app.listen(port, () => {
    const address = server.address();
    if (address && typeof address === 'object') {
        console.log(`🚀 Servidor rodando em: http://localhost:${address.port}`);
        console.log(`📡 API disponível na porta ${address.port}`);
        console.log(`🌐 Acesse: http://localhost:${address.port}`);
    }
});