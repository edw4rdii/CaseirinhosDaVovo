import 'dotenv/config';
import express from "express";
import formData from "express-form-data";
import cors from "cors";
import getCatalogoRoutes from "./routes/catalogoRoutes.js";
import rotas from "./routes/index.js";
import naoEncontrado from "./middlewares/nao-encontrado.middleware.js";
import tratarErros from "./middlewares/erros.middleware.js";

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  optionsSuccessStatus: 200
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(formData.format());
app.use(express.static("uploads"));
app.use('/api', rotas);

getCatalogoRoutes(app);

// Sempre por último: 404 para rota inexistente e depois o tratamento de erros.
app.use(naoEncontrado);
app.use(tratarErros);

// A Vercel importa este app (ver vercel.json) e chama ele por requisição.
export default app;
