const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const verifyToken = require('../middleware/account');

router.get('/', verifyToken, controller.projectView);
router.get("/search", verifyToken, controller.getProjectByKey);

router.get('/:id', verifyToken, controller.projectDetailView);
router.post('/create', verifyToken, controller.createProject);

router.get('/:id/test-case', verifyToken, controller.testCaseView);
router.post('/:id/test-case/create', verifyToken, controller.createTestCase);

router.get('/:id/test-run', verifyToken, controller.testRunView);
router.post('/:id/test-run/create', verifyToken, controller.createTestRun);

router.get('/:id/issues', verifyToken, controller.issuesView);
router.get('/:id/issues/:issueId', verifyToken, controller.issueDetailView);

router.post('/:id/issues/create', verifyToken, controller.createIssue)

router.get('/:id/report', verifyToken, controller.reportView);

router.use('/:id/activity', verifyToken, controller.getActivities);
router.use('/:id/activity/all', verifyToken, controller.getAllActivities);


module.exports = router;