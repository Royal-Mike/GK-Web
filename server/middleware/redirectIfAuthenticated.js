const jwt = require("jsonwebtoken");

const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return res.redirect('/home');  // Chuyển hướng đến trang /home nếu đã đăng nhập
    } catch (error) {
        return res.redirect('/account/login'); // Nếu token không hợp lệ, tiếp tục cho phép truy cập vào trang login
    }
  }
  next();
};

module.exports = redirectIfAuthenticated;
