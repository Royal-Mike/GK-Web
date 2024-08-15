"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.Project, { foreignKey: "project_id" });
    }
  }

  Activity.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      project_id: DataTypes.INTEGER,
      title_name: DataTypes.STRING,
      action: { type: DataTypes.STRING, validate: { isIn: [['edit', 'create', 'delete']] } },
      time: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
    },
    {
      sequelize,
      modelName: "Activity",
      tableName: "Activities",
      timestamps: false,
    }
  );

  return Activity;
};
