'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User_Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.belongsTo(models.Project, { foreignKey: 'project_id' });
    }
  }

  User_Project.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Project',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User_Project',
    timestamps: false,
    underscored: true,
    tableName: 'User_Project'
  });

  return User_Project;
};
