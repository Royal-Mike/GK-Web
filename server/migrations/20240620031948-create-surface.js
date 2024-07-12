'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Surfaces', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            format: {
                type: Sequelize.STRING,
            },
            width: {
                type: Sequelize.INTEGER,
            },
            height: {
                type: Sequelize.INTEGER,
            },
            imgUrl: {
                type: Sequelize.STRING,
            },
            spaceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Spaces',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
        await queryInterface.dropTable('Surfaces');
    }
};
