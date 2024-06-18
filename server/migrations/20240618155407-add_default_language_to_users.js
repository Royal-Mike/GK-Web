'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Users', 'language', {
            type: Sequelize.STRING,
            defaultValue: 'vn'
        });
        await queryInterface.changeColumn('Users', 'lastname', {
            type: Sequelize.STRING,
            defaultValue: ''
        });
        await queryInterface.changeColumn('Users', 'headline', {
            type: Sequelize.STRING,
            defaultValue: ''
        });
        await queryInterface.changeColumn('Users', 'website-link', {
            type: Sequelize.STRING,
            defaultValue: ''
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Users', 'language', {
            type: Sequelize.STRING
        });
        await queryInterface.changeColumn('Users', 'lastname', {
            type: Sequelize.STRING
        });
        await queryInterface.changeColumn('Users', 'headline', {
            type: Sequelize.STRING
        });
        await queryInterface.changeColumn('Users', 'website-link', {
            type: Sequelize.STRING
        });
    }
};

