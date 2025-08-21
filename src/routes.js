import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionsController from "./app/controllers/SessionsController";
import TokenController from "./app/controllers/TokenController";
import StatsController from "./app/controllers/StatsController";

const routes = new Router();

// cadastro/login
routes.post("/users", UserController.store);
routes.post("/sessions", SessionsController.store);

// listar usuários (se já tem o index)
routes.get("/users", UserController.index);

// tokens
routes.post("/token/generate", TokenController.generate);

// liberação sem auth:
const allowWithoutAuth = (req, _res, next) => {
  req.user = { admin: true };
  next();
};
routes.post("/token/validate", allowWithoutAuth, TokenController.validate);

// stats para o dashboard
routes.get("/stats", StatsController.index);

export default routes;
