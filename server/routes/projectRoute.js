const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const verifyToken = require('../middleware/account');
const { uploadFile, uploadReq } = require('../middleware/upload'); 
const { verify } = require('jsonwebtoken');

router.get('/', verifyToken, controller.projectView);
router.get("/search", verifyToken, controller.getProjectByKey);
router.post('/create', verifyToken, controller.createProject);
router.delete('/delete', verifyToken, controller.deleteProject);

router.get('/:id', verifyToken, controller.projectDetailView);
router.post('/:id/update', verifyToken, controller.updateProject);
router.post('/:id/add-member', verifyToken, controller.addMemberToProject);
router.post('/:id/remove-member', verifyToken, controller.removeMemberFromProject);

router.get('/:id/requirement', verifyToken, controller.requirementView);
router.post('/:id/requirement/upload', verifyToken, uploadReq.single('data_link'), controller.uploadRequirement);
router.delete('/:projectId/requirement/:attachmentId',verifyToken, controller.deleteAttachment);
router.put('/:projectId/requirement/:attachmentId/content', verifyToken, controller.updateRequirementContent);

router.get('/:id/attachment', verifyToken, controller.attachmentView);
router.post('/:id/attachment/upload', verifyToken, uploadFile.single('data_link'), controller.uploadAttachment);
router.delete('/:projectId/attachment/:attachmentId',verifyToken, controller.deleteAttachment);


router.get('/:id/release', verifyToken, controller.releaseView);
router.get('/:id/module', verifyToken, controller.moduleView);

router.get('/:id/test-case', verifyToken, controller.testCaseView);
router.post('/:id/test-case/create', verifyToken, controller.createTestCase);
router.get('/:id/test-case/:testCaseId', verifyToken, controller.fetchTestCaseDetails);
router.post('/:projectId/test-case/:testCaseId/edit', verifyToken, controller.editTestCase);
router.delete('/:id/testcase/delete', verifyToken, controller.deleteTestCase);

router.get('/:id/test-run', verifyToken, controller.testRunView);
router.post('/:id/test-run/create', verifyToken, controller.createTestRun);

router.get('/:id/issues', verifyToken, controller.issuesView);
router.get('/:id/issues/:issueId', verifyToken, controller.issueDetailView);
router.post('/:id/issues/create', verifyToken, controller.createIssue);
router.delete('/:id/issues/delete', verifyToken, controller.deleteIssue);

router.get('/:id/release', verifyToken, controller.releaseView);
router.post('/:id/release/create', verifyToken, controller.createRelease);
router.delete('/:id/release/:releaseId/delete', verifyToken, controller.deleteRelease);
router.put('/:id/release/:releaseId/edit', verifyToken, controller.editRelease);
router.get('/:id/release/:releaseId', verifyToken, controller.releaseDetailView);

router.get('/:id/report', verifyToken, controller.reportView);

router.use('/:id/activity', verifyToken, controller.getActivities);
router.use('/:id/activity/all', verifyToken, controller.getAllActivities);


module.exports = router;