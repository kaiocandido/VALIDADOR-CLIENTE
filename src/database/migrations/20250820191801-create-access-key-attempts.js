module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("access_key_attempts", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      key: { type: Sequelize.STRING(64), allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      email: { type: Sequelize.STRING, allowNull: true },
      success: { type: Sequelize.BOOLEAN, allowNull: false },
      reason: { type: Sequelize.STRING, allowNull: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("access_key_attempts", ["created_at"]);
    await queryInterface.addIndex("access_key_attempts", ["success"]);
    await queryInterface.addIndex("access_key_attempts", ["email"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("access_key_attempts");
  },
};
