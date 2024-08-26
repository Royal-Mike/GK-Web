'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test_Run extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Test_Run.belongsTo(models.User, { foreignKey: 'assigned_to_user_id', as: 'assigned' });
    }
  }
  Test_Run.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    test_plan_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    assigned_to_user_id: DataTypes.INTEGER,
    started_at: DataTypes.DATE,
    completed_at: DataTypes.DATE,
    issue_assigned: DataTypes.INTEGER,
    testcase_assigned: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Test_Run',
    timestamps: true
  });
  return Test_Run;
};