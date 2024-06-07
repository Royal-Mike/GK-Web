const controller = {}
const { where } = require('sequelize');
const models = require('../models');
//xử lý cho trang chủ
controller.homeView = async (req, res, next) => {
    try {
        // console.log(req);
        const userId = req.userid; // Lấy user ID từ token đã xác thực

        // Lấy thông tin user từ cơ sở dữ liệu
        const user = await models.User.findByPk(userId);
        // console.log(user);
        // Any additional logic or data fetching can be done here
        res.render('user/homeView', {user});
    } catch (error) {
        next(error);
    }
};

module.exports = controller;