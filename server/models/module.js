'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Module.belongsTo(models.User, { foreignKey: 'created_by', as: 'developer' });
    }
  }
  Module.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    language: DataTypes.STRING,
    datacode: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Module',
  });
  return Module;
};