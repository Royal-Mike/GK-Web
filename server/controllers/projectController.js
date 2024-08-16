const controller = {};
const { where } = require("sequelize");
const models = require("../models");
const { Op } = require("sequelize");
const { isNumericString } = require('../utils/helpers'); 
const fs = require('fs');
const path = require('path');

controller.projectView = async (req, res, next) => {
    try {
        const userId = req.userid;
        let { page, sortBy, sortOrder, searchTerm } = req.query;

        page = page ? parseInt(page) : 1;
        const pageSize = 8;
        const offset = (page - 1) * pageSize;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userProjects = await models.User_Project.findAll({
            where: { user_id: userId },
        });
        const projectIds = userProjects.map((up) => up.project_id);

        let whereCondition = { id: projectIds };
        if (searchTerm) {
            whereCondition.name_project = { [Op.iLike]: `%${searchTerm}%` };
        }

        let orderCondition = [["created_at", "DESC"]];
        if (sortBy && ["name_project", "created_at"].includes(sortBy)) {
            orderCondition = [[sortBy, sortOrder === "asc" ? "ASC" : "DESC"]];
        }

        const count = await models.Project.count({ where: whereCondition });

        const projects = await models.Project.findAll({
            where: whereCondition,
            order: orderCondition,
            limit: pageSize,
            offset: offset,
        });

        const projectsWithFounders = await Promise.all(
            projects.map(async (project) => {
                const founder = await models.User_Project.findOne({
                    where: {
                        project_id: project.id,
                        role_id: 1, // Assuming role_id 1 indicates the founder
                    },
                    include: {
                        model: models.User,
                        attributes: ['username'],
                    },
                });

                const projectData = project.toJSON();
                projectData.projectFounder = founder ? founder.User.username : null;

                return projectData;
            })
        );

        const totalPages = Math.ceil(count / pageSize);

        res.render("tester/project-view", {
            user,
            userProjects,
            projects: projectsWithFounders,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
};

controller.getProjectByKey = async (req, res, next) => {
  try {
    const { page, sortBy, sortOrder, searchTerm } = req.query;
    const userId = req.userid;

    const pageSize = 8;
    const offset = (page - 1) * pageSize;

    const user = await models.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProjects = await models.User_Project.findAll({
      where: { user_id: userId },
    });
    const projectIds = userProjects.map((up) => up.project_id);

    let whereCondition = { id: projectIds };
    if (searchTerm) {
      whereCondition.name_project = { [Op.iLike]: `%${searchTerm}%` };
    }

    let orderCondition = [["created_at", "DESC"]];
    if (sortBy && ["name_project", "created_at"].includes(sortBy)) {
      orderCondition = [[sortBy, sortOrder === "asc" ? "ASC" : "DESC"]];
    }

    const count = await models.Project.count({ where: whereCondition });

    const projects = await models.Project.findAll({
      where: whereCondition,
      order: orderCondition,
      limit: pageSize,
      offset: offset,
    });

      const projectsWithFounders = await Promise.all(
          projects.map(async (project) => {
              const founder = await models.User_Project.findOne({
                  where: {
                      project_id: project.id,
                      role_id: 1, // Assuming role_id 1 indicates the founder
                  },
                  include: {
                      model: models.User,
                      attributes: ['username'],
                  },
              });

              const projectData = project.toJSON();
              projectData.projectFounder = founder ? founder.User.username : null;

              return projectData;
          })
      );

    const totalPages = Math.ceil(count / pageSize);

      res.json({ projects: projectsWithFounders, currentPage: page, totalPages });
  } catch (error) {
    next(error);
  }
};


controller.projectDetailView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!isNumericString(projectId)) {
            res.cookie('error', 'Invalid Project ID type');
            return res.redirect('/project');
        }

        // Lấy thông tin project từ cơ sở dữ liệu
        const project = await models.Project.findByPk(projectId);

        if (!project) {
            res.cookie('error', 'Project not found');
            return res.redirect('/project');
        }

        // Lấy danh sách các user trong current project
        const usersInProject = await models.User_Project.findAll({
            where: { project_id: projectId },
            include: {
                model: models.User
            },
            order: [
                ['role_id', 'ASC']
            ]
        });

        const usersInProjectCount = usersInProject.length;

        // Lấy danh sách các user không trong current project
        const usersNotInProject = await models.User.findAll({
            where: {
                id: { [Op.notIn]: usersInProject.map(up => up.user_id) }
            }
        });

        // Truyền thông tin project và danh sách user không trong project tới view
        res.render("user/project-detail", {
            user,
            project,
            usersInProject,
            usersNotInProject,
            usersInProjectCount
        });
    } catch (error) {
        next(error);
    }
};

controller.addMemberToProject = async (req, res) => {
    try {
        const { userId, projectId, role } = req.body;

        // Add the user to the project
        await models.User_Project.create({
            user_id: userId,
            project_id: projectId,
            role_id: role,
        });

        res.status(200).json({ message: 'Member added to the project' });
    } catch (error) {
        console.error('Error adding member to project:', error);
        res.status(500).json({ error: 'An error occurred while adding the member' });
    }
};

controller.removeMemberFromProject = async (req, res) => {
    try {
        const { userId, projectId } = req.body;

        // Ensure both userId and projectId are valid
        if (!userId || !projectId) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        // Remove the user from the project
        await models.User_Project.destroy({
            where: {
                user_id: userId,
                project_id: projectId
            }
        });

        res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const specialSymbolsRegex = /[!@#$%^&*(),.?":{}|<>]/;

controller.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userid;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Project name is required." });
    }

    // Check if name contains special symbols
    if (specialSymbolsRegex.test(name)) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Project name cannot contain special symbols.",
        });
    }

    const maxProjectId = await models.Project.max("id");

    // Create the project
    const project = await models.Project.create({
      id: maxProjectId + 1,
      name_project: name,
      description,
      created_at: new Date(),
    });

    // Create association in User_Project table
    await models.User_Project.create({
      user_id: userId,
      project_id: project.id,
      role_id: 1,
    });

    // Return the newly created project to the client
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error(error);
    // Handle specific validation errors
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message });
    }
    res
      .status(500)
      .json({
        success: false,
        message:
          "An error occurred while creating the project. Please try again.",
      });
  }
};

controller.updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const projectId = req.params.id;

        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "Project name is required." });
        }

        // Check if name contains special symbols
        if (specialSymbolsRegex.test(name)) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Project name cannot contain special symbols.",
                });
        }

        // Find the project to be updated
        const project = await models.Project.findOne({ where: { id: projectId } });

        if (!project) {
            return res
                .status(404)
                .json({ success: false, message: "Project not found." });
        }

        // Update the project
        await project.update({
            name_project: name,
            description,
        });

        // Return the updated project to the client
        res.status(201).json({ success: true, project });
    } catch (error) {
        console.error(error);
        // Handle specific validation errors
        if (error.name === "SequelizeValidationError") {
            return res
                .status(400)
                .json({ success: false, message: error.errors[0].message });
        }
        res
            .status(500)
            .json({
                success: false,
                message:
                    "An error occurred while updating the project. Please try again.",
            });
    }
};

controller.deleteProject = async (req, res) => {
    try {
        const { id } = req.body;

        const project = await models.Project.findByPk(id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        // Delete associated entries in User_Project table
        await models.User_Project.destroy({ where: { project_id: id } });

        // Now delete the project itself
        await project.destroy();

        // Return success response
        res.status(200).json({ success: true, message: "Project deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the project. Please try again.",
        });
    }
};


controller.attachmentView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const project = await models.Project.findByPk(projectId, {
            include: {
                model: models.Attachment,
                attributes: ['id', 'data_link', 'isRequirement'] // Include id, data_link, and isRequirement attributes
            }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Filter attachments where isRequirement is false
        const attachments = project.Attachments.filter(attachment => !attachment.isRequirement).map(attachment => {
            const data_link = attachment.data_link;
            const filename = data_link.split('/').pop(); // Extract filename from data_link
            return {
                id: attachment.id, // Include attachment ID
                data_link,
                filename
            };
        });

        res.render("tester/attachment", {
            user,
            project,
            attachments // Pass the attachments array with id, data_link, and filename
        });
    } catch (error) {
        next(error);
    }
};


controller.requirementView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const project = await models.Project.findByPk(projectId, {
            include: {
                model: models.Attachment,
                attributes: ['id', 'data_link', 'isRequirement'] 
            }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        
        const requirements = project.Attachments.filter(attachment => attachment.isRequirement).map(attachment => {
            const data_link = attachment.data_link;
            const filename = data_link.split('/').pop(); 
            return {
                id: attachment.id, 
                data_link,
                filename
            };
        });

        res.render("tester/requirement", {
            user,
            project,
            requirements 
        });
    } catch (error) {
        next(error);
    }
};

controller.uploadAttachment = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Please upload a file!",
                });
        }

        const userId = req.userid;
        const projectId = req.params.id;
        const attachmentUrl = `/upload/attachment/${req.file.filename}`;

        // Save the attachment data to the database
        const newAttachment = await models.Attachment.create({
            project_id: projectId,
            data_link: attachmentUrl,
            uploaded_by: userId,
            isRequirement: false
        });

        res.status(200).json({
            success: true,
            attachmentUrl: newAttachment.data_link
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Could not upload the file. Please try again later."
        });
    }
};

controller.uploadRequirement = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Please upload a text file!",
                });
        }

        const userId = req.userid;
        const projectId = req.params.id;
        const requirementUrl = `/upload/attachment/${req.file.filename}`;

        // Save the attachment data to the database
        const newAttachment = await models.Attachment.create({
            project_id: projectId,
            data_link: requirementUrl,
            uploaded_by: userId,
            isRequirement: true
        });

        res.status(200).json({
            success: true,
            requirementUrl: newAttachment.data_link
        });
    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: "Multer error: " + err.message
            });
        }
        // Handle other errors
        console.error("Error uploading file:", err);
        res.status(500).json({
            success: false,
            message: "Could not upload the file. Please try again later."
        });
    }
};


controller.deleteAttachment = async (req, res, next) => {
    try {
        const { projectId, attachmentId } = req.params;

        const project = await models.Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const attachment = await models.Attachment.findOne({
            where: {
                id: attachmentId,
                project_id: projectId
            }
        });
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        // Delete the file from the upload directory
        const filePath = path.join(__dirname, '/../../client/assets', attachment.data_link);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete the attachment record from the database
        await attachment.destroy();

        res.status(200).json({ message: "Attachment deleted successfully" });
    } catch (error) {
        next(error);
    }
};

controller.updateRequirementContent = async (req, res) => {
    try {
        const attachmentId = req.params.attachmentId;
        const updatedContent = req.body.content; // Assuming 'content' is sent in the request body

        // Find the attachment by ID
        const attachment = await models.Attachment.findByPk(attachmentId);
        if (!attachment) {
            return res.status(404).json({ success: false, message: 'Attachment not found' });
        }

        // Determine the file path based on 'data_link'
        const filePath = path.join(__dirname, '/../../client/assets', attachment.data_link);

        // Write updated content to the file
        fs.writeFile(filePath, updatedContent, err => {
            if (err) {
                console.error('Error updating file content:', err);
                return res.status(500).json({ success: false, message: 'Failed to update file content' });
            }
            res.status(200).json({ success: true, message: 'File content updated successfully' });
        });
    } catch (error) {
        console.error('Error updating requirement content:', error);
        res.status(500).json({ success: false, message: 'Failed to update requirement content' });
    }
};


controller.moduleView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        const pageSize = 10;
        const offset = (page - 1) * pageSize;

        const project = await models.Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Fetch only basic test case info for pagination
        const modules = await models.Module.findAndCountAll({
            where: { project_id: project.id },
            limit: pageSize,
            offset: offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: models.User,
                    as: 'developer',
                    attributes: ['username'] 
                }
            ]
        });

        const totalPages = Math.ceil(modules.count / pageSize);

        // Render the view with project, user, and test cases data
        res.render("tester/module", {
            user,
            project,
            modules: modules.rows,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
};

controller.createModule = async (req, res) => {
    try {
        const { name, description, language, datacode } = req.body;
        const projectId = req.params.id;
        const userId = req.userid;

        const maxModuleId = await models.Module.max("id") || 0;

        const module = await models.Module.create({
            id: maxModuleId + 1,
            project_id: projectId,
            name,
            description,
            language,
            datacode,
            createdAt: new Date(),
            updatedAt: new Date(),
            created_by: userId,
        });

        res.status(201).json({ success: true, module });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

controller.testCaseView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        const pageSize = 5;
        const offset = (page - 1) * pageSize;

        const project = await models.Project.findByPk(projectId, {
            include: {
                model: models.Attachment,
                attributes: ['id', 'data_link', 'isRequirement'] 
            }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const modules = await models.Module.findAll({
            where: { project_id: project.id }
        });

        
        const requirements = project.Attachments.filter(attachment => attachment.isRequirement).map(attachment => {
            const data_link = attachment.data_link;
            const filename = data_link.split('/').pop();
            return {
                id: attachment.id,
                data_link,
                filename
            };
        });

        // Fetch only basic test case info for pagination
        const testcases = await models.Testcase.findAndCountAll({
            where: { project_id: project.id },
            limit: pageSize,
            offset: offset,
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: models.User,
                    as: 'CreatedByUser',
                    attributes: ['username'] // Fetch only 'username' attribute of User
                }
            ]
        });

        const totalPages = Math.ceil(testcases.count / pageSize);

        // Render the view with project, user, and test cases data
        res.render("tester/test-case", {
            user,
            project,
            testcases: testcases.rows,
            currentPage: page,
            totalPages,
            modules,
            requirements,
        });
    } catch (error) {
        next(error);
    }
};

// Controller to fetch full test case details
controller.fetchTestCaseDetails = async (req, res) => {
    try {
        const testCaseId = req.params.testCaseId;

        // Fetch the test case details including created by user
        const testCase = await models.Testcase.findByPk(testCaseId, {
            include: [
                {
                    model: models.User,
                    as: 'CreatedByUser',
                    attributes: ['username']
                }
            ]
        });

        if (!testCase) {
            return res.status(404).json({ message: "Test case not found" });
        }

        res.json(testCase); // Return the fetched test case as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


controller.createTestCase = async (req, res) => {
    try {
        const { name, description, module, precondition, steps, result, linkedRequirements, linkedIssues} = req.body;
        const projectId = req.params.id;
        const userId = req.userid;

        const maxTestCaseId = await models.Testcase.max("id");

        const testCase = await models.Testcase.create({
            id: maxTestCaseId + 1,
            project_id: projectId,
            title: name,
            description,
            module,
            precondition,
            steps,
            expected_result: result,
            linked_requirements: linkedRequirements,
            linked_issues: linkedIssues,
            created_at: new Date(),
            updated_at: new Date(),
            created_by_user_id: userId,
        });

        res.status(201).json({ success: true, testCase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Controller function to edit a test case
controller.editTestCase = async (req, res, next) => {
    const projectId = req.params.projectId;
    const testCaseId = req.params.testCaseId;
    const {
        title,
        module,
        linkedRequirements,
        linkedIssues,
        description,
        precondition,
        steps
    } = req.body;

    try {
        // Find the test case by ID and project ID
        const testCase = await models.Testcase.findOne({
            where: {
                id: testCaseId,
                project_id: projectId
            }
        });

        if (!testCase) {
            return res.status(404).json({ message: 'Test case not found' });
        }

        // Update test case fields
        testCase.title = title;
        testCase.module = module;
        testCase.linked_requirements = linkedRequirements;
        testCase.linked_issues = linkedIssues;
        testCase.description = description;
        testCase.precondition = precondition;
        testCase.steps = steps;
        testCase.updated_at = new Date();

        // Save the updated test case
        await testCase.save();

        // Respond with updated test case data
        res.status(200).json(testCase);
    } catch (error) {
        next(error);
    }
};

controller.deleteTestCase = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { testCaseId } = req.body;

        // Log the testCaseId
        console.log(`Attempting to delete test case with ID: ${testCaseId}`);

        // Check if the project exists
        const project = await models.Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Find the test case to delete
        const testCase = await models.Testcase.findByPk(testCaseId);
        if (!testCase) {
            return res.status(404).json({ message: "Test case not found" });
        }

        // Delete the test case
        await testCase.destroy();

        // Send a success response
        res.status(200).json({ message: "Test case deleted successfully" });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};


controller.testPlanView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const project = await models.Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const testPlans = await models.Test_Plan.findAll({
            where: { project_id: project.id }
        });

        res.render("tester/test-plan", {
            user, project, testPlans
        });
    } catch (error) {
        next(error);
    }
}

controller.createTestPlan = async (req, res) => {
    try {
        const { name, description } = req.body;
        const projectId = req.params.id;

        const maxTestPlanId = await models.Test_Plan.max("id");

        const testPlan = await models.Test_Plan.create({
            id: maxTestPlanId + 1,
            project_id: projectId,
            name,
            description,
            created_at: new Date(),
            updated_at: new Date(),
        });

        res.status(201).json({ success: true, testPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


controller.testRunView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const page = isNaN(req.query.page)
            ? 1
            : Math.max(1, parseInt(req.query.page));
        const pageSize = 5;
        const offset = (page - 1) * pageSize;

        const project = await models.Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const testcases = await models.Testcase.findAll({
            where: { project_id: project.id },
        });

        const issues = await models.Issue.findAll({
            where: { project_id: project.id },
        });

        const releases = await models.Release.findAll({
            where: { project_id: project.id },
        });

        const testPlans = await models.Test_Plan.findAll({
            where: { project_id: project.id }
        });

        const testPlanIds = testPlans.map(plan => plan.id);

        const usersWithRole = await models.User_Project.findAll({
            where: {
                project_id: projectId,
                role_id: 3,
            },
            include: [
                {
                    model: models.User,
                    attributes: ["id", "username"],
                },
            ],
        });

        const users = usersWithRole.map((up) => up.User);

        testRuns = [];

        if (testPlanIds.length != 0) {
            testRuns = await models.Test_Run.findAndCountAll({
                where: { test_plan_id: testPlanIds },
                limit: pageSize,
                offset: offset,
                include: [
                    {
                        model: models.User,
                        as: "assigned",
                        attributes: ["id", "username"],
                    },
                ],
            });
        }

        const totalPages = Math.ceil(testRuns.count / pageSize);

        res.render("tester/test-run", {
            user,
            project,
            testRuns: testRuns.rows,
            currentPage: page,
            totalPages,
            users,
            testcases,
            issues,
            releases,
            testPlans
        });
    } catch (error) {
        console.error("Error fetching test runs:", error);
        next(error);
    }
};


controller.createTestRun = async (req, res) => {
    try {
        const { name, test_plan_id, test_case_id, issue_id, assigned_to_user_id, release_id } = req.body;
        const projectId = req.params.id;
        const maxTestRunId = await models.Test_Run.max("id");

        if (!test_plan_id) {
            return res.status(401).json({
                success: false,
                message: "Please select a test plan for this test run",
            });
        }

        if (!assigned_to_user_id) {
            return res.status(402).json({
                success: false,
                message: "Please assign a tester for this test run, if there are no tester then please add some",
            });
        }

        const newTestRun = await models.Test_Run.create({
            name,
            id: maxTestRunId + 1,
            project_id: projectId,
            test_plan_id,
            testcase_assigned: test_case_id,
            issue_assigned: issue_id,
            status: "Pending",
            assigned_to_user_id,
            release_id,
            started_at: new Date(),
        });

        const testcaseUpdated = await models.Testcase.findByPk(test_case_id);
        if (testcaseUpdated) {
            testcaseUpdated.linked_issues = issue_id;
            await testcaseUpdated.save(); // Save the updated testcase
        } else {
            return res.status(404).json({ success: false, message: "Test case not found" });
        }

        const issueUpdated = await models.Issue.findByPk(issue_id);
        if (issueUpdated) {
            issueUpdated.linked_testcase = test_case_id;
            await issueUpdated.save(); // Save the updated issue
        } else {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        res.status(201).json({ success: true, newTestRun });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Failed to create test run" });
    }
};




controller.releaseView = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
    const pageSize = 8;
    const offset = (page - 1) * pageSize;

    const project = await models.Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { count, rows: releases } = await models.Release.findAndCountAll({
      where: { project_id: projectId },
      attributes: ["id", "name", "start_at", "released_at", "description", "created_at"], 
      order: [["created_at", "DESC"]],
      limit: pageSize,
      offset: offset,
    });

    const totalPages = Math.ceil(count / pageSize);

    res.render("user/release", { project, projectId, releases, currentPage: page, totalPages });
  } catch (error) {
    next(error);
  }
};

controller.releaseDetailView = async (req, res, next) => {
  try {
      const projectId = req.params.id;
      const releaseId = req.params.releaseId;
      // if (!isNumericString(projectId)) {
      //     res.cookie('error', 'Invalid Project ID type');
      //     return res.redirect('/project');
      // }

      // Lấy thông tin project từ cơ sở dữ liệu
      const project = await models.Project.findByPk(projectId);

      if (!project) {
          res.cookie('error', 'Project not found');
          return res.redirect('/project');
      }

      const release = await models.Release.findByPk(releaseId, {
        order: [['created_at', 'ASC']] // Sắp xếp theo created_at từ mới nhất đến cũ nhất
    });
          if (!release) {
        res.cookie('error', 'Release not found');
        return res.redirect('/project');
    }

      // Truyền thông tin release tới view
      res.render("user/release-detail", { project, release });
  } catch (error) {
      next(error);
  }
};


controller.createRelease = async (req, res) => {
  try {
    const { name, start, end, description } = req.body;
    const projectId = req.params.id;

    const maxReleaseId = await models.Release.max("id");

    // Tạo một bản ghi test run mới trong cơ sở dữ liệu
    const newRelease = await models.Release.create({
      id: maxReleaseId + 1,
      name,
      description,
      project_id: projectId, // Sử dụng projectId từ req.params.id
      released_at: end,
      start_at: start,
    });


    // Return the newly created test run to the client
    res.status(201).json({ success: true, newRelease});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create release" });
  }
};

controller.deleteRelease = async (req, res) => {
  try {
      const releaseId = req.params.releaseId;

      // Xóa release từ cơ sở dữ liệu
      const deletedRelease = await models.Release.destroy({
          where: {
              id: releaseId
          }
      });

      if (deletedRelease) {
          res.status(204).json({ success: true });
      } else {
          res.status(404).json({ error: "Release not found" });
      }
  } catch (error) {
      console.error('Error deleting release:', error.message);
      res.status(500).json({ error: "Failed to delete release" });
  }
};


controller.editRelease = async (req, res) => {
  const projectId = req.params.projectId;
  const releaseId = req.params.releaseId;

  try {
      // Assuming you have middleware to handle JSON parsing for request body
      const { name, start_at, released_at, description } = req.body;

      // Find the release by releaseId and update its attributes
      const release = await models.Release.findByPk(releaseId);
      if (!release) {
          return res.status(404).json({ message: "Release not found" });
      }

      // Update release attributes
      release.name = name;
      release.start_at = start_at;
      release.released_at = released_at;
      release.description = description;

      // Save changes to the database
      await release.save();

      // Optionally, you can send back the updated release as response
      res.json({ message: "Release updated successfully", release });

  } catch (error) {
      console.error('Error updating release:', error);
      res.status(500).json({ message: "Failed to update release" });
  }
};





controller.getActivities = async (req, res,next) => {
  // const name = req.query.keyword | "";
  // const projectId = req.query.projectId | 0;
  // const page = parseInt(req.query.page) | 1;
  // const size = parseInt(req.query.size) | 0;

  // try {
  //   let whereClause = {};

  //   whereClause = {
  //     [models.Sequelize.Op.and]: [
  //       { name: { [models.Sequelize.Op.like]: `%${name}%` } },
  //       { project_id: projectId },
  //     ],
  //   };

  //   const limit = size;
  //   const offset = (page - 1) * size;

  //   const { count, rows: activities } = await models.Activity.findAndCountAll({
  //     where: whereClause,
  //     limit,
  //     offset,
  //   });

  //   if (!activities || activities.length === 0) {
  //     return res.status(404).json({ message: "No activities found" });
  //   }

  //   return res.status(200).json({
  //     totalItems: count,
  //     totalPages: Math.ceil(count / limit),
  //     currentPage: page,
  //     activities: activities,
  //   });
  // } catch (error) {
  //   return res
  //     .status(500)
  //     .json({ message: "Internal server error", error: error.message });
  // }
  try {
    // Pass project and test run information to the view
    res.render("user/activity");
  } catch (error) {
    next(error);
  }
};

controller.getAllActivities = async (req, res,next) => {
  // try {
  //     const activities = await models.Activity.findAll();

  //     if (!activities || activities.length === 0) {
  //     return res.status(404).json({ message: "No activities found" });
  //     }

  //     return res.status(200).json({
  //         activities: activities,
  //     });
  // } catch (error) {
  //     return res
  //     .status(500)
  //     .json({ message: "Internal server error", error: error.message });
  // }
  try {
    // Pass project and test run information to the view
    res.render("user/activity");
  } catch (error) {
    next(error);
  }
};



// Lấy chi tiết dự án
controller.issuesView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;
  
        const user = await models.User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
         // Fetch project to ensure it exists
         const project = await models.Project.findByPk(projectId);
         if (!project) {
           return res.status(404).json({ message: "Project not found" });
         }
  
          const issues = await models.Issue.findAll({
              where: {
                  project_id: projectId,
              },
              include: [
                  {
                      model: models.User,
                      as: "creator", // Alias phải trùng với tên đã định nghĩa trong mối quan hệ
                      attributes: ["id", "username"],
                  }
              ],
          });

        const usersWithRole = await models.User_Project.findAll({
            where: {
                project_id: projectId,
                role_id: 2,
            },
            include: [
                {
                    model: models.User,
                    attributes: ["id", "username"],
                },
            ],
        });

        const devs = usersWithRole.map((up) => up.User);

          res.render("developer/issues", { user, projectId, project, issues, devs });
    } catch (error) {
        next(error);
    }

};
  
  controller.issueDetailView = async (req, res, next) => {
    try {
        const userId = req.userid;
        const projectId = req.params.id;
  
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const issueId = req.params.issueId;
  
      // Fetch project to ensure it exists
      const project = await models.Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Fetch issue to ensure it exists
      const issue = await models.Issue.findOne({
        where: {
          id: issueId,
        },
        include: [
          {
            model: models.User,
            as: "creator", // Alias phải trùng với tên đã định nghĩa trong mối quan hệ
            attributes: ["id", "username"],
          }
        ],
      });
  
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
  
      // Render issue detail view and pass data
      res.render("developer/issues-detail", { user, project, issue, projectId });
    } catch (error) {
      next(error);
    }
  };

  

// Thêm issue
controller.createIssue = async (req, res) => {
    try {
      const { title, status, priority, description, dev } = req.body;
      const projectId = req.params.id;
      const userId = req.userid; 
  
      // Validate input data
      if (!title || !status || !priority || !projectId || !dev) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      // Check if the project exists
      const project = await models.Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
  
  
      // Get the maximum ID from the Issue table to generate a new unique ID
      const maxIssueId = await models.Issue.max("id");
  
      // Create a new issue in the database
      const newIssue = await models.Issue.create({
        id: maxIssueId + 1,
        project_id: projectId,
        title: title,
        status: status,
        priority: priority,
        description: description,
        created_at: new Date(),
        assigned_to_user_id: dev, 
        created_by_user_id: userId,
      });
  
      // Return the newly created issue to the client
      return res.status(201).json({ success: true, issue: newIssue });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  };
  

// edit issue
controller.editIssue = async (req, res) => {
    const { title, status, priority, note } = req.body;
    const id = req.params.id;
    console.log(title, status, priority, note, id)
    try {
      const issue = await models.Issue.findByPk(id);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      if (title !== undefined) issue.name = title;
      if (status !== undefined) issue.status = status;
      if (priority !== undefined) issue.priority = priority;
      if (note !== undefined) issue.note = note;
      await issue.save();
      console.log('Issue updated:', issue.toJSON());
      return res.status(200).json(issue);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };


  controller.deleteIssue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { issueId } = req.body;

        // Log the testCaseId
        console.log(`Attempting to delete issue with ID: ${issueId}`);

        // Check if the project exists
        const project = await models.Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Find the test case to delete
        const issue = await models.Issue.findByPk(issueId);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        // Delete the test case
        await issue.destroy();

        // Send a success response
        res.status(200).json({ message: "Issue deleted successfully" });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};
  




controller.reportView = async (req, res, next) => {
  try {
      const userId = req.userid;
      const projectId = req.params.id;

      const user = await models.User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      // Fetch project to ensure it exists
    const project = await models.Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch all test runs related to the project
    const reports = await models.Report.findAll({
      where: { related_project_id: projectId }
        });
      // Pass project and test run information to the view
      res.render('user/reports', {user, project, reports});
  } catch (error) {
      next(error);
  }
};





controller.getActivities = async (req, res, next) => {
    // const name = req.query.keyword | "";
    // const projectId = req.query.projectId | 0;
    // const page = parseInt(req.query.page) | 1;
    // const size = parseInt(req.query.size) | 0;

    // try {
    //   let whereClause = {};

    //   whereClause = {
    //     [models.Sequelize.Op.and]: [
    //       { name: { [models.Sequelize.Op.like]: `%${name}%` } },
    //       { project_id: projectId },
    //     ],
    //   };

    //   const limit = size;
    //   const offset = (page - 1) * size;

    //   const { count, rows: activities } = await models.Activity.findAndCountAll({
    //     where: whereClause,
    //     limit,
    //     offset,
    //   });

    //   if (!activities || activities.length === 0) {
    //     return res.status(404).json({ message: "No activities found" });
    //   }

    //   return res.status(200).json({
    //     totalItems: count,
    //     totalPages: Math.ceil(count / limit),
    //     currentPage: page,
    //     activities: activities,
    //   });
    // } catch (error) {
    //   return res
    //     .status(500)
    //     .json({ message: "Internal server error", error: error.message });
    // }
    try {
        // Pass project and test run information to the view
        const userId = req.userid;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.render("user/activity", {
            user
        });
    } catch (error) {
        next(error);
    }
};

controller.getAllActivities = async (req, res, next) => {
    // try {
    //     const activities = await models.Activity.findAll();

    //     if (!activities || activities.length === 0) {
    //     return res.status(404).json({ message: "No activities found" });
    //     }

    //     return res.status(200).json({
    //         activities: activities,
    //     });
    // } catch (error) {
    //     return res
    //     .status(500)
    //     .json({ message: "Internal server error", error: error.message });
    // }
    try {
        // Pass project and test run information to the view
        const userId = req.userid;

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.render("user/activity", {
            user
        });
    } catch (error) {
        next(error);
    }
};
module.exports = controller;
