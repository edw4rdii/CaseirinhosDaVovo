import { controllerGet } from "../controllers/catalogoController.js";

const getCatalogoRoutes = (app) => {
  app.get("/", controllerGet);
}

export default getCatalogoRoutes;