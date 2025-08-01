'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('Users', [{
      username: 'alice',
      email: 'alice@example.com',
      password: passwordHash,
      role: 'seller',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};