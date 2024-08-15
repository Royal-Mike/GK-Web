'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Testcase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
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
    expected_result: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    linked_requirements: DataTypes.INTEGER,
    linked_issues: DataTypes.TEXT,
    project_id: DataTypes.INTEGER,
    created_by_user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Testcase',
    timestamps: true
  });
  return Testcase;
};