import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT deve ser um número inteiro entre 1 e 65535.");
}

app.use(express.static(__dirname, { index: "index.html" }));

app.use((request, response, next) => {
  if (request.method === "GET" && request.accepts("html")) {
    response.sendFile(path.join(__dirname, "index.html"), (error) => {
      if (error) next(error);
    });
    return;
  }

  response.status(404).json({ error: "Recurso não encontrado." });
});

app.use((error, request, response, next) => {
  console.error(error);
  if (response.headersSent) {
    next(error);
    return;
  }

  response.status(500).json({ error: "Erro interno ao servir a aplicação." });
});

app.listen(port, () => {
  console.log(`Caseirinhos da Vovó disponível em http://localhost:${port}`);
});
