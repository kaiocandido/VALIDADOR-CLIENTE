import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionsController from "./app/controllers/SessionsController";
import TokenController from "./app/controllers/TokenController";
import authMiddleware from "./app/middlawares/authMiddleware";

const routes = new Router();

// Cadastro de usuário
routes.post("/users", UserController.store);
// Login
routes.post("/sessions", SessionsController.store);

// Gera chave (sem autenticação)
routes.post("/token/generate", TokenController.generate);

// Valida chave (só admin autenticado)
routes.post("/token/validate", authMiddleware, TokenController.validate);

export default routes;
