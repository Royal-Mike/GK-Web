'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Define associations if any (e.g., User.hasMany(models.Post))
        }
    }

    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        account_type: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        headline: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        website_link: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        language: {
            type: DataTypes.STRING,
            defaultValue: 'vn'
        },
        avatar: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User', // Model name in singular form
        hooks: {
            beforeCreate: (user, options) => {
                // Set firstname to username if not already provided
                if (!user.firstname && user.username) {
                    user.firstname = user.username;
                }
            }
        },
        // Other options like timestamps, underscored, etc., can be defined here
    });

    return User;
};
