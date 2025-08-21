import "./database";
import cors from "cors";

import express from "express";
import routes from "./routes";

class App {
  constructor() {
    // Instância do servidor Express
    this.app = express();
    this.app.use(cors());
    // Configuração dos middlewares
    this.middleware();
    // Rotas
    this.routes();
  }

  middleware() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
