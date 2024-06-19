'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add firstname column with default value of username
        await queryInterface.addColumn('Users', 'firstname', {
                type: Sequelize.STRING,
                defaultValue: function () {
                    return this.getDataValue('username');
                }
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove firstname column
        await queryInterface.removeColumn('Users', 'firstname');
    }
};
