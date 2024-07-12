'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Attachment extends Model {
        static associate(models) {
            // Define association with Project
            Attachment.belongsTo(models.Project, {
                foreignKey: 'project_id',
                as: 'from_project'
            });
            // Define association with User
            Attachment.belongsTo(models.User, {
                foreignKey: 'uploaded_by',
                as: 'uploader'
            });
        }
    }

    Attachment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Project',
                key: 'id'
            }
        },
        data_link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uploaded_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Attachment',
        tableName: 'Attachments',
        timestamps: true // Enable timestamps if you want createdAt and updatedAt
    });

    return Attachment;
};
