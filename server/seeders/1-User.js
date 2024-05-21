'use strict';
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await User.bulkCreate([
      {
        username: 'phong',
        account_type: 'standard',
        email: 'phog.27.12@gmail.com',
        password: '123',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // Add more seed data if needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
