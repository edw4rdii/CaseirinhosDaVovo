import 'dotenv/config';
import express from "express";
import formData from "express-form-data";
import getCatalogoRoutes from './routes/catalogoRoutes.js';

const app = express();
app.use(express.json());
app.use(formData.format());
app.use(express.static("uploads"));
getCatalogoRoutes(app);

app.listen(3000, () => {
    console.log("Servidor on");
});

app.get('/', (req, res) => {
  res.send('Conexão bem-sucedida! O servidor está funcionando corretamente.');
});