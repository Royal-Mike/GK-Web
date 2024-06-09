// models/report.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config.json');
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        created_by_user_id: DataTypes.INTEGER,
        related_test_case_id: DataTypes.INTEGER,
        related_test_run_id: DataTypes.INTEGER,
        related_project_id: DataTypes.INTEGER,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });
    Report.associate = function (models) {
        Report.belongsTo(models.User, { foreignKey: 'created_by_user_id' });
        Report.belongsTo(models.TestCase, { foreignKey: 'related_test_case_id' });
        Report.belongsTo(models.TestRun, { foreignKey: 'related_test_run_id' });
        Report.belongsTo(models.Project, { foreignKey: 'related_project_id' });
    };
    return Report;
};