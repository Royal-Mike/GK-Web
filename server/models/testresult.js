// models/test_result.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const TestResult = sequelize.define('TestResult', {
        test_run_id: DataTypes.INTEGER,
        test_case_id: DataTypes.INTEGER,
        status: DataTypes.STRING,
        started_at: DataTypes.DATE,
        completed_at: DataTypes.DATE,
        notes: DataTypes.TEXT
    }, {
        timestamps: false
    });
    TestResult.associate = function (models) {
        TestResult.belongsTo(models.TestRun, { foreignKey: 'test_run_id' });
        TestResult.belongsTo(models.TestCase, { foreignKey: 'test_case_id' });
    };
    return TestResult;
};