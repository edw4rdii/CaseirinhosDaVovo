import { ObjectId } from "mongodb";
import ErroHttp from "../utils/erro-http.js";

export function validarId(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return next(new ErroHttp(400, "id inválido"));
  }
  next();
}
