const controller = {}
const { where } = require('sequelize');
const models = require('../models');
//xử lý cho trang chủ
controller.getAccountControl = async (req, res, next) => {
    try {
        // Any additional logic or data fetching can be done here
        res.render('user/profile');
    } catch (error) {
        next(error);
    }
};

module.exports = controller;