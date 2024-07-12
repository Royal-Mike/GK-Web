'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Spaces', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            long: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            lat: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
            },
            format: {
                type: Sequelize.STRING,
            },
            ward: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Spaces');
    }
};
