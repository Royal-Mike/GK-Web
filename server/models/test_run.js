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
      // define association here
    }
  }
  Test_Run.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    test_case_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    assigned_to_user_id: DataTypes.INTEGER,
    started_at: DataTypes.DATE,
    completed_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Test_Run',
  });
  return Test_Run;
};