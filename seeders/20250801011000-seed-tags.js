'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Tags', [
      { name: 'announcement', createdAt: new Date(), updatedAt: new Date() },
      { name: 'news',         createdAt: new Date(), updatedAt: new Date() },
      { name: 'fun',          createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};