/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "number_phone", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "number_phone");
  },
};
