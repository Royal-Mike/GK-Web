'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Token.init({
    email: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    code: DataTypes.INTEGER,
    created_time: DataTypes.DATE,
    expired_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};