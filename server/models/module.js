'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Module extends Model {
        static associate(models) {
            // Define association with Project
            Module.belongsTo(models.Project, {
                foreignKey: 'project_id',
                as: 'project'
            });
            // Define association with User
            Module.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'developer'
            });
        }
    }

    Module.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Project',
                key: 'id'
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        datacode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Module',
        tableName: 'Modules',
        timestamps: true // Enable timestamps if you want createdAt and updatedAt
    });

    return Module;
};
