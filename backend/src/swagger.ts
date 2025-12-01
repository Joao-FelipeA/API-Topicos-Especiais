import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de serviços de refrigeradores",
      version: "1.0.0",
      description: "Uma API para serviços de refrigeradores",
    },
    servers: [
      {
        url: `http://localhost:3001`,
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Cliente: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "João Silva" },
            CPF: { type: "string", example: "12345678901" },
            CNPJ: { type: ["string", "null"], example: null },
            email: { type: "string", example: "joao@email.com" },
            telefone: { type: "string", example: "11999990000" },
            servicos: {
              type: "array",
              items: {
                type: "object",
                properties: { id: { type: "integer" } },
              },
            },
          },
        },
        Funcionario: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Maria Santos" },
            telefone: { type: "string", example: "11999999999" },
            email: { type: "string", example: "maria@email.com" },
            especialidade: { type: ["string", "null"], example: "Técnico" },
            servicos: {
              type: "array",
              items: {
                type: "object",
                properties: { id: { type: "integer" } },
              },
            },
          },
        },
        Servico: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            status: { type: "string", example: "aberto" },
            valor_total: { type: "number", example: 150.5 },
            clienteID: { type: "integer", example: 1 },
            funcionarioID: { type: "integer", example: 2 },
            dta_abertura: { type: "string", format: "date-time" },
            dta_conclusao: { type: ["string", "null"], format: "date-time" },
          },
        },
      },
    },
  },
  // ajusta o padrão para o diretório correto (case-sensitive em algumas plataformas)
  apis: ["./src/Routes/*.ts", "./src/Controller/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
