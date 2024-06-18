require("dotenv").config();
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET); // Debug log
const controller = {};
const jwt = require("jsonwebtoken");
const { where } = require('sequelize');
const models = require('../models');
const { hashPassword, comparePassword } = require("../utils/hash");

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

        const dehashPassword = await comparePassword(password, user.password);
        // Kiểm tra xem người dùng có tồn tại và mật khẩu có khớp không
        if (dehashPassword && user.password) {

            const accessToken = jwt.sign(
                { userid: user.id },
                process.env.ACCESS_TOKEN_SECRET
            );

            res.cookie("token", accessToken, {
                httpOnly: true,
                //secure: true,
                //maxAge: 1000000,
                //signed: true,
            });
            res.status(200).json({
                success: true,
                message: "Login successfully!",
                accessToken,
            });
        } else {
            // Đăng nhập thất bại
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình truy vấn cơ sở dữ liệu
        next(error);
    }
};

// Register logic remains unchanged
controller.registerPage = async (req, res) => {
    try {
        // Any additional logic or data fetching can be done here
        res.render('signup-signin/signup', { layout: false });
    } catch (error) {
        next(error);
    }
};

controller.registerWithVerificationControl = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingAccount = await models.User.findOne({ where: { email: email } });
        if (existingAccount) {
            return res.status(200).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await hashPassword(password);

        const user = new models.User({
            username: name,
            email: email,
            password: hashedPassword,
        });

        await user.save();

        const accessToken = jwt.sign(
            { userid: user.id },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.cookie("token", accessToken, {
            httpOnly: true,
            //secure: true,
            //maxAge: 1000000,
            //signed: true,
        });
        res.status(200).json({
            success: true,
            message: "Registration successful!",
            accessToken,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = controller;
