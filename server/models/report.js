'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // define association here
    }
  }
  Report.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    related_test_case_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    related_test_run_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    related_project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Report',
    tableName: 'Reports', // Ensure the table name is correct
    timestamps: false // Disable timestamps if not using createdAt and updatedAt
  });
  return Report;
};
