'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Testcase extends Model {
        static associate(models) {
            Testcase.belongsTo(models.Project, { foreignKey: 'project_id' });
            Testcase.belongsTo(models.User, { foreignKey: 'created_by_user_id', as: 'CreatedByUser' });
        }
    }

    Testcase.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        module: DataTypes.STRING,
        description: DataTypes.TEXT,
        precondition: DataTypes.TEXT,
        steps: DataTypes.TEXT,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        linked_requirements: DataTypes.INTEGER,
        linked_issues: DataTypes.TEXT,
        project_id: DataTypes.INTEGER,
        created_by_user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Testcase',
        tableName: 'Testcase',
        timestamps: false // handling manually
    });

    return Testcase;
};
