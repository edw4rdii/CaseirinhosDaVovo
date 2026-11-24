import { controllerGet, controllerTesteBanco } from "../controllers/catalogoControllers.js";

const getCatalogoRoutes = (app) => {
  app.get("/teste", controllerGet);
  app.get("/teste-banco", controllerTesteBanco);
}

export default getCatalogoRoutes;
