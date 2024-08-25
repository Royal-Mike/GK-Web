'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Testcases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      module: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      precondition: {
        type: Sequelize.TEXT
      },
      steps: {
        type: Sequelize.TEXT
      },
      expected_result: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      linked_requirements: {
        type: Sequelize.INTEGER
      },
      linked_issues: {
        type: Sequelize.TEXT
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      created_by_user_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Testcases');
  }
};