'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Testcase extends Model {
    static associate(models) {
      // Định nghĩa mối quan hệ với model Project
      Testcase.belongsTo(models.Project, { foreignKey: 'project_id' });
    }
  }

  Testcase.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    project_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Testcase',
    tableName: 'Testcase', // Tên bảng trong database
    timestamps: false // Không sử dụng createdAt và updatedAt
  });

  return Testcase;
};
