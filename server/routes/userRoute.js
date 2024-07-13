const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/account');
const { uploadAvatar } = require('../middleware/upload'); // Destructure correctly

router.get('/', verifyToken, userController.getAccountControl);

router.post('/update', verifyToken, userController.updateProfile);
router.post('/upload-avatar', verifyToken, uploadAvatar.single('avatar'), userController.uploadAvatar);

module.exports = router;
