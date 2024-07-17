'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('Test_Run', 'test_case_id', 'test_plan_id');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('Test_Run', 'test_plan_id', 'test_case_id');
    }
};
