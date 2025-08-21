import Sequelize, { Model } from "sequelize";
import bcrypt from "bcrypt";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        cnpj: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        number_phone: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        enterpriseName: {
          type: Sequelize.STRING,
          allowNull: false,
          field: "enterprise_name",
        },
        password: Sequelize.VIRTUAL,
        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "users",
        timestamps: true,
        underscored: true,
      },
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 16);
      }
    });

    return this;
  }

  async comparePassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
