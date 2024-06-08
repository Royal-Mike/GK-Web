const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const verifyToken = require('../middleware/account');

router.get('/', verifyToken, controller.projectView);
router.get('/:id', verifyToken, controller.projectDetailView);

module.exports = router;
