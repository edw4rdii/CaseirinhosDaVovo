import 'dotenv/config';
import express from "express";
import formData from "express-form-data";
import cors from "cors";
import getCatalogoRoutes from "./routes/catalogoRoutes.js";

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(formData.format());
app.use(express.static("uploads"));

getCatalogoRoutes(app);

// Na Vercel não existe servidor "escutando": ela chama o app exportado.
// Então o listen só roda quando você executa localmente.
//if (!process.env.STRING_CONEXAO) {
//  const PORT = process.env.PORT || 3000;
//  app.listen(PORT, () => {
//    console.log(`Servidor escutando na porta ${PORT}...`);
//  });
//}

export default app;