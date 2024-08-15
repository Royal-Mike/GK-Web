'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Issue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Issue.belongsTo(models.User, { foreignKey: 'assigned_to_user_id', as: 'creator' });
    }
  }
  Issue.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    test_run_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    priority: DataTypes.STRING,
    assigned_to_user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Issue',
  });
  return Issue;
};