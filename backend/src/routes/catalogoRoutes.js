import { controllerGet } from "../controllers/catalogoControllers.js";

const getCatalogoRoutes = (app) => {
  app.get("/teste", controllerGet);
}

export default getCatalogoRoutes;