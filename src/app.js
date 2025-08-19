import express from "express";
import routes from "./routes";
import "./database";
import cors from "cors";
/*
Esse código cria um servidor Express, conecta ao banco de dados, configura middlewares para entender JSON e registra as rotas da API, 
exportando o servidor pronto para ser usado.
*/
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
