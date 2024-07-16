'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Test_Run', 'issue_assigned', {
            type: Sequelize.INTEGER,
            allowNull: true
        });

        await queryInterface.addColumn('Test_Run', 'testcase_assigned', {
            type: Sequelize.INTEGER,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Test_Run', 'issue_assigned');
        await queryInterface.removeColumn('Test_Run', 'testcase_assigned');
    }
};
