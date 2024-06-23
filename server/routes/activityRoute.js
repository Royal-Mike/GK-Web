const express = require('express');
const router = express.Router();
const controller = require('../controllers/activityController');
const verifyToken = require('../middleware/account');

router.get("/", controller.getActivities);
router.get("/all", controller.getAllActivities);

module.exports = router;
