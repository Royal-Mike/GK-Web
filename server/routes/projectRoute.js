const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const verifyToken = require('../middleware/account');

router.get('/', verifyToken, controller.projectView);

module.exports = router;
