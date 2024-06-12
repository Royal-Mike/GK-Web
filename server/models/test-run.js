'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TestRun extends Model {
    static associate(models) {
      // Định nghĩa mối quan hệ với model Project
      TestRun.belongsTo(models.Project, { foreignKey: 'project_id' });
      TestRun.belongsTo(models.User, { foreignKey: 'assigned_to_user_id' });
      TestRun.belongsTo(models.Testcase, { foreignKey: 'test_case_id' });

    }
  }

  TestRun.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: DataTypes.INTEGER,
    test_case_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    assigned_to_user_id: DataTypes.INTEGER,
    started_at: DataTypes.DATE,
    completed_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'TestRun',
    tableName: 'Test_Run', // Tên bảng trong database
    timestamps: false // Disable the automatic createdAt and updatedAt fields
  });

  return TestRun;
};
