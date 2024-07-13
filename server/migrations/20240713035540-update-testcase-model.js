'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Testcase', 'module', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('Testcase', 'precondition', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('Testcase', 'steps', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('Testcase', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: true
        });

        await queryInterface.addColumn('Testcase', 'linked_requirements', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('Testcase', 'linked_issues', {
            type: Sequelize.TEXT,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Testcase', 'module');
        await queryInterface.removeColumn('Testcase', 'precondition');
        await queryInterface.removeColumn('Testcase', 'steps');
        await queryInterface.removeColumn('Testcase', 'updated_at');
        await queryInterface.removeColumn('Testcase', 'linked_requirements');
        await queryInterface.removeColumn('Testcase', 'linked_issues');
    }
};
