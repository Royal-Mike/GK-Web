'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Reports', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            surfaceId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Surfaces',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            address: {
                type: Sequelize.STRING,
            },
            long: {
                type: Sequelize.FLOAT,
            },
            lat: {
                type: Sequelize.FLOAT,
            },
            report_date: {
                type: Sequelize.DATE,
            },
            content: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            state: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('Reports');
    }
};
