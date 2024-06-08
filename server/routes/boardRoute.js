const express = require('express');
const router = express.Router();
const controller = require('../controllers/boardController');
const verifyToken = require('../middleware/account');

router.get('/', verifyToken, controller.boardView);

module.exports = router;
