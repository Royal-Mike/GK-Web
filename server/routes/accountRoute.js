const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const redirectIfAuthenticated = require('../middleware/redirectIfAuthenticated');

// Định nghĩa tuyến đường /login và gọi hàm xử lý từ accountController
router.get("/", redirectIfAuthenticated, accountController.loginPage);
router.post("/login", accountController.loginControl);



module.exports = router;