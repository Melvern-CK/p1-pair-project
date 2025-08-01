'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'lastLogin', {
      type: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'lastLogin');
  }
};
