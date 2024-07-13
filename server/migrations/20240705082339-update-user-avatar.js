'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Users', 'avatar', {
            type: Sequelize.STRING,
            defaultValue: '/images/boy.png'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Users', 'avatar', {
            type: Sequelize.STRING
        });
    }
};
