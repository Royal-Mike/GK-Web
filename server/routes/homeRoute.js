const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const verifyToken = require('../middleware/account');

router.get('/', verifyToken, homeController.homeView);

module.exports = router;
