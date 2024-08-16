'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Release extends Model {
    static associate(models) {
      // Define associations here
      Release.belongsTo(models.Project, { foreignKey: 'project_id' });
    }
  }
  Release.init({
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
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Project',
        key: 'id'
      },
      allowNull: false
    },
    released_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Release',
    tableName: 'Releases',
    timestamps: true
  });
  
  return Release;
};
