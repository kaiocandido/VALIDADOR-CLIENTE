import Sequelize from "sequelize";
import User from "../app/models/User";
import AccessKey from "../app/models/AccessKey";
import configDatabase from "../app/config/database";
import AccessKeyAttempt from "../app/models/AccessKeyAttempt";

const models = [User, AccessKey, AccessKeyAttempt];

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
