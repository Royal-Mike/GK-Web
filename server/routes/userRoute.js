const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/account');

router.get('/', verifyToken, userController.getAccountControl);

router.post('/update', verifyToken, userController.updateProfile);

module.exports = router;
