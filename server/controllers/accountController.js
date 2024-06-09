require("dotenv").config();
const controller = {}
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
    //   if (existingAccount && !existingAccount.google_id && !existingAccount.facebook_id) {
    //     return res.status(200).json({ success: false, error: "Email already exists!" });
    //   }
    if (existingAccount) {
        return res.status(200).json({ success: false, error: "Email already exists!" });
      }

      const hashedPassword = await hashPassword(password);
  
  
      const user = new models.User({
        username: name,
        email: email,
        password: hashedPassword,
      });
  
    //   const verificationCode = Math.floor(100000 + Math.random() * 900000);
    //   const token = new Token({
    //     email: email,
    //     code: verificationCode,
    //   });
  
      await user.save();
  
    //   let isSentSuccessfully = await sendMail(email, MailType.VERIFICATION, verificationCode);
    //   if (!isSentSuccessfully) {
    //     return res.status(500).json({
    //       success: false,
    //       message: "Error sending verification code",
    //     });
    //   }
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

    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
//   const verifyAccountControl = async (req, res) => {
//     try {
//       const token = await Token.findOne({ code: req.body.otp });
//       if (!token) {
//         return res.json({
//           success: false,
//           message: "We were unable to find a valid token. Your token might have expired.",
//         });
//       }
//       console.log("confirm token: ", token);
//       const account = await Account.findOne({
//         email: token.email,
//         google_id: null,
//         facebook_id: null,
//       });
//       if (!account) {
//         return res.status(400).json({
//           success: false,
//           message: "We were unable to find an account for this token.",
//         });
//       }
//       account.is_verified = true;
//       await account.save();
//       await Token.findOneAndRemove({ code: req.params.code }).exec();
  
//       return res.status(200).json({
//         success: true,
//         message: "The account has been verified. Please log in.",
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ success: false, message: "Internal server error" });
//     }
//   };
  


module.exports = controller;