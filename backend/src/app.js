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

// A Vercel importa este app (ver vercel.json) e chama ele por requisição.
export default app;
