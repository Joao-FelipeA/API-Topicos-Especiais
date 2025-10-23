# Trabalho de construção de uma API

## Passos para trabalhar no ambiente de desenvolvimento:
1. Clonar o repositório:
```bash
git clone https://github.com/Joao-FelipeA/API-Topicos-Especiais.git
```
2. configurar arquivo .env com a URL do banco de dados no backend:
```bash
DATABASE_URL="postgresql://postgres:COLOQUE_SUA_SENHA_AQUI@localhost:3000/topicos_especiais?schema=public"
```
3. Instalar dependências:
```bash
npm run setup
```
4. Iniciar ambiente de desenvolvimento no backend:
```bash
npm run dev:backend
```
4. Iniciar ambiente de desenvolvimento no frontend:
```bash
npm run dev:frontend
```