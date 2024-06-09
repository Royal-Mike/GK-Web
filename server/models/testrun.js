// models/test_run.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const TestRun = sequelize.define('TestRun', {
        test_case_id: DataTypes.INTEGER,
        project_id: DataTypes.INTEGER,
        status: DataTypes.STRING,
        assigned_to_user_id: DataTypes.INTEGER,
        started_at: DataTypes.DATE,
        completed_at: DataTypes.DATE
    }, {
        timestamps: false
    });
    TestRun.associate = function (models) {
        TestRun.belongsTo(models.TestCase, { foreignKey: 'test_case_id' });
        TestRun.belongsTo(models.Project, { foreignKey: 'project_id' });
        TestRun.belongsTo(models.User, { foreignKey: 'assigned_to_user_id' });
        TestRun.hasMany(models.TestResult, { foreignKey: 'test_run_id' });
        TestRun.hasMany(models.Issue, { foreignKey: 'test_run_id' });
        TestRun.hasMany(models.Report, { foreignKey: 'related_test_run_id' });
    };
    return TestRun;
};