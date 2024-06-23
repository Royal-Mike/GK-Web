// migrations/[timestamp]-add-created-by-user-to-testcase.js

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Testcase', 'created_by_user_id', {
            type: Sequelize.INTEGER,
            allowNull: true, // Adjust allowNull based on your requirements
            references: {
                model: 'Users', // Adjust based on your User model name
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Testcase', 'created_by_user_id');
    }
};
