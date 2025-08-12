import Sequelize from "sequelize";
import User from "../app/models/User";
import AccessKey from "../app/models/AccessKey";
import configDatabase from "../app/config/database";
/*
Esse código centraliza toda a lógica de conexão com o banco e inicialização dos models, deixando o restante do código mais organizado.

- Conecta ao banco de dados.

- Registra os models no Sequelize.

- Deixa a conexão pronta para ser usada nas consultas.

*/
const models = [User, AccessKey];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models.forEach((model) => model.init(this.connection));
  }
}

export default new Database();
