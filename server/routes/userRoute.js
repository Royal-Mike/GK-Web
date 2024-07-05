const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/account');
const uploadFile = require('../middleware/uploadAvatar');

router.get('/', verifyToken, userController.getAccountControl);

router.post('/update', verifyToken, userController.updateProfile);
router.post('/upload-avatar', verifyToken, uploadFile.single('avatar'), userController.uploadAvatar);

module.exports = router;
