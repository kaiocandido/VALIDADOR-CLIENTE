import { Model, DataTypes } from "sequelize";

class AccessKeyAttempt extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        key: DataTypes.STRING,
        user_id: DataTypes.UUID,
        email: DataTypes.STRING,
        success: DataTypes.BOOLEAN,
        reason: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "access_key_attempts",
        underscored: true,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export default AccessKeyAttempt;
