// models/issue.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Issue = sequelize.define('Issue', {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        test_run_id: DataTypes.INTEGER,
        status: DataTypes.STRING,
        priority: DataTypes.STRING,
        assigned_to_user_id: DataTypes.INTEGER,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });
    Issue.associate = function (models) {
        Issue.belongsTo(models.TestRun, { foreignKey: 'test_run_id' });
        Issue.belongsTo(models.User, { foreignKey: 'assigned_to_user_id' });
    };
    return Issue;
};