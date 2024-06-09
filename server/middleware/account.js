const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Lấy token từ cookie
    if (!token)
        return res.status(401).json({ success: false, message: "Access token not found" });

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userid = decoded.userid;
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid token" });
    }
};  

module.exports = verifyToken;
