const controller = {}
const jwt = require("jsonwebtoken");
const { where } = require('sequelize');
const models = require('../models');

const createToken = async (userId, email, token, expiredTime) => {
    try {
        await models.Token.create({
            userId: userId,
            email: email,
            code: token,
            created_time: new Date(),
            expired_time: expiredTime
        });
    } catch (error) {
        console.error("Error creating token:", error);
    }
};

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
            // Tạo token
            const accessToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);
            const tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 48); // Token hết hạn sau 48 giờ

            // Lưu token vào cơ sở dữ liệu
            await createToken(user.id,email, accessToken, tokenExpiry);

            // Đăng nhập thành công, gửi token về cho người dùng
            res.status(200).json({ message: "Login successful", accessToken: accessToken });
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