// models/role.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT
    }, {
        timestamps: false
    });
    Role.associate = function (models) {
        Role.hasMany(models.UserProject, { foreignKey: 'role_id' });
    };
    return Role;
};