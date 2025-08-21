import Sequelize, { Model } from "sequelize";

class AccessKey extends Model {
  static init(sequelize) {
    super.init(
      {
        key: Sequelize.STRING,
        expires_at: Sequelize.DATE,
        user_id: Sequelize.UUID,
      },
      {
        sequelize,
        tableName: "access_keys",
      },
    );

    return this;
  }
}

export default AccessKey;
