'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Testcase', 'linked_requirements');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Testcase', 'linked_requirements', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    }
};
