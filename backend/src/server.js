// Uso local apenas: `npm run dev` / `npm start`.
// Na Vercel quem é executado é o src/app.js (ver vercel.json).
import app from "./app.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}...`);
});
