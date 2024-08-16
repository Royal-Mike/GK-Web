'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
      static associate(models) {
          Project.hasMany(models.Attachment, {
              foreignKey: 'project_id'
          });
          Project.hasMany(models.Test_Plan, { foreignKey: 'project_id' });
          Project.hasMany(models.Module, { foreignKey: 'project_id' });
      }
  }
  Project.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name_project: DataTypes.STRING, // Đảm bảo cột này đúng tên
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'Projects', // Đảm bảo sử dụng đúng tên bảng
    timestamps: true // nếu bạn không sử dụng createdAt và updatedAt
  });
  return Project;
};
