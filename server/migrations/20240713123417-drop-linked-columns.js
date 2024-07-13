'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Testcase', 'linked_issues');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Testcase', 'linked_issues', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    }
};
