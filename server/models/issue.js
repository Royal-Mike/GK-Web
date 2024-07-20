'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Issue extends Model {
    static associate(models) {
      // Define associations here
        Issue.belongsTo(models.Project, { foreignKey: 'project_id' });
        Issue.belongsTo(models.User, { foreignKey: 'assigned_to_user_id', as: 'developer' });
        Issue.belongsTo(models.User, { foreignKey: 'created_by_user_id', as: 'creator' });
    }
  }
  Issue.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
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
        model: 'Project', // Ensures the reference to the TestRuns table
        key: 'id'
      },
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assigned_to_user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User', // Ensures the reference to the Users table
        key: 'id'
      },
      allowNull: false
    },
    created_by_user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User', // Ensures the reference to the Users table
            key: 'id'
        },
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    linked_testcase: {
        type: DataTypes.INTEGER,
    }
    }, {
    sequelize,
    modelName: 'Issue',
    tableName: 'Issues', // Ensure the correct table name
    timestamps: false // If you don't use createdAt and updatedAt
    });
    return Issue;
};
