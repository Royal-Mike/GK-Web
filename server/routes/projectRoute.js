const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const verifyToken = require('../middleware/account');

router.get('/', verifyToken, controller.projectView);
router.get('/:id', verifyToken, controller.projectDetailView);
router.post('/create', verifyToken, controller.createProject);

router.get('/:id/test-case', verifyToken, controller.testCaseView);
router.post('/:id/test-case/create', verifyToken, controller.createTestCase);

module.exports = router;
