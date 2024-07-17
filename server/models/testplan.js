'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TestPlan extends Model {
        static associate(models) {
            // Define associations here
            TestPlan.belongsTo(models.Project, { foreignKey: 'project_id' });
            TestPlan.hasMany(models.TestRun, { foreignKey: 'test_plan_id' }); // Assuming TestRun model
        }
    }

    TestPlan.init({
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
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'TestPlan',
        tableName: 'Test_Plan', // Customize table name if needed
        timestamps: false // Disable the automatic createdAt and updatedAt fields
    });

    return TestPlan;
};
