'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'lastname', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Users', 'firstname', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Users', 'headline', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Users', 'website_link', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Users', 'language', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Users', 'avatar', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'lastname');
        await queryInterface.removeColumn('Users', 'firstname');
        await queryInterface.removeColumn('Users', 'headline');
        await queryInterface.removeColumn('Users', 'website_link');
        await queryInterface.removeColumn('Users', 'language');
        await queryInterface.removeColumn('Users', 'avatar');
    }
};