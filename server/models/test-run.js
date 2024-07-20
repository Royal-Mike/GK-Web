'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TestRun extends Model {
        static associate(models) {
            TestRun.belongsTo(models.User, { foreignKey: 'assigned_to_user_id', as: 'assigned'});
            TestRun.belongsTo(models.TestPlan, { foreignKey: 'test_plan_id' });
        }
    }

    TestRun.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        test_plan_id: DataTypes.INTEGER, // Update the field name
        status: DataTypes.STRING,
        assigned_to_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User', // Ensures the reference to the Users table
                key: 'id'
            },
            allowNull: false
        },
        started_at: DataTypes.DATE,
        completed_at: DataTypes.DATE,
        issue_assigned: DataTypes.INTEGER, // Add this line
        testcase_assigned: DataTypes.INTEGER // Add this line
    }, {
        sequelize,
        modelName: 'TestRun',
        tableName: 'Test_Run',
        timestamps: false
    });

    return TestRun;
};
