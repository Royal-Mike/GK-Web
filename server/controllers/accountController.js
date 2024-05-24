require("dotenv").config();
const controller = {}
const jwt = require("jsonwebtoken");
const { where } = require('sequelize');
const models = require('../models');


//xử lý cho trang chủ
controller.loginPage = async (req, res) => {
    try {
        // Any additional logic or data fetching can be done here
        res.render('signup-signin/signin', { layout: false });
    } catch (error) {
        next(error);
    }
};

controller.loginControl = async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;

    try {
        // Tìm người dùng trong cơ sở dữ liệu dựa trên email
        const user = await models.User.findOne({ where: { email: email } });

        // Kiểm tra xem người dùng có tồn tại và mật khẩu có khớp không
        if (user && user.password === password) {

            const accessToken = jwt.sign(
                { userid: user.id },
                process.env.ACCESS_TOKEN_SECRET
              );
              res.cookie("token", accessToken, {
                httpOnly: true,
                //secure: true,
                //maxAge: 1000000,
                //signed: true,
              })
              res.status(200).json({
                success: true,
                message: "Login successfully!",
                accessToken,
              });

        } else {
            // Đăng nhập thất bại
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình truy vấn cơ sở dữ liệu
        next(error);
    }
};



module.exports = controller;