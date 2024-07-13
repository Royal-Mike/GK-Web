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

        // Truyền thông tin project tới view
        res.render("user/project-detail", { user, project });
    } catch (error) {
        next(error);
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

        // Lấy tất cả các test runs liên quan đến dự án
        const testRuns = await models.TestRun.findAll({ where: { project_id: id } });

        if (testRuns.length > 0) {
            // Lấy tất cả các test run IDs
            const testRunIds = testRuns.map(testRun => testRun.id);

            // Xóa tất cả các test results liên quan đến test runs
            await models.Test_Result.destroy({ where: { test_run_id: testRunIds } });

            // Xóa tất cả các issues liên quan đến test runs
            await models.Issue.destroy({ where: { test_run_id: testRunIds } });

            // Xóa tất cả các test runs liên quan
            await models.TestRun.destroy({ where: { project_id: id } });
        }

        // Xóa các bản ghi liên quan trong bảng User_Project
        await models.User_Project.destroy({ where: { project_id: id } });

        // Cuối cùng, xóa dự án
        await project.destroy();

        // Trả về phản hồi thành công
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


controller.releaseView = async (req, res, next) => {
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
        res.render("tester/release", {
            user, project
        });
    } catch (error) {
        next(error);
    }
}

controller.moduleView = async (req, res, next) => {
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
        res.render("tester/module", {
            user, project
        });
    } catch (error) {
        next(error);
    }
}

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

        const project = await models.Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

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
        const { name, description, module, precondition, steps, linkedRequirements, linkedIssues } = req.body;
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

    // Fetch project info from the database
    const project = await models.Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch test runs associated with the project
    const testRuns = await models.TestRun.findAndCountAll({
      where: { project_id: project.id },
      limit: pageSize,
      offset: offset,
    });

    // Tìm tất cả các testcase có project_id bằng project.id
    const testcases = await models.Testcase.findAll({
      where: { project_id: project.id },
    });

    // Fetch users with role_id = 3 associated with the project from the User_Project table
    const usersWithRole = await models.User_Project.findAll({
      where: {
        project_id: projectId,
        role_id: 3,
      },
      include: [
        {
          model: models.User,
          attributes: ["id", "username"], // Select only necessary attributes
        },
      ],
    });

    // Extract the user data from the result
    const users = usersWithRole.map((up) => up.User);

    // Calculate total pages
    const totalPages = Math.ceil(testRuns.count / pageSize);

    // Pass project and test run information to the view
      res.render("tester/test-run", {
          user,
          project,
          testRuns: testRuns.rows,
          currentPage: page,
          totalPages,
          users,
          testcases,
    });
  } catch (error) {
    next(error);
  }
};

controller.createTestRun = async (req, res) => {
    try {
        const { name, test_case_id, assigned_to_user_id, release_description } =
            req.body;
        const projectId = req.params.id;
        const userID = req.userid;
        const maxTestRunId = await models.TestRun.max("id");

        // Set the assigned_to_user_id to a default value if not provided
        const assignedToUserId = assigned_to_user_id || userID; // Use a default user ID, e.g., 1

        // Create a new test run record in the database
        const newTestRun = await models.TestRun.create({
            id: maxTestRunId + 1,
            project_id: projectId,
            test_case_id,
            status: "Pending",
            assigned_to_user_id: assignedToUserId,
            started_at: new Date(),
        });

        // Fetch the latest list of test runs
        const testRuns = await models.TestRun.findAll({
            where: { project_id: projectId },
            order: [["started_at", "DESC"]],
            limit: 10,
        });

        // Return the newly created test run to the client
        res.status(201).json({ success: true, newTestRun, testRuns });
    } catch (error) {
        console.error(error);
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
  
         // Fetch all test runs related to the project
         const testRuns = await models.TestRun.findAll({
             where: { project_id: projectId },
             attributes: ["id"],
         });
  
      // Extract test run IDs
      const testRunIds = testRuns.map((testRun) => testRun.id);
  
      const issues = await models.Issue.findAll({
          where: {
              test_run_id: testRunIds,
          },
          include: [
              {
                  model: models.User,
                  as: "User", // Alias phải trùng với tên đã định nghĩa trong mối quan hệ
                  attributes: ["id", "username"],
              },
          ],
      });
  
      // Render issues view and pass data
      res.render("developer/issues", { user, projectId, project, issues });
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
            model: models.TestRun,
            where: { project_id: projectId },
            attributes: ["id", "project_id"],
          },
          {
            model: models.User,
            as: "User", // Alias phải trùng với tên đã định nghĩa trong mối quan hệ
            attributes: ["id", "username"],
          },
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
      const { title, status, priority, description } = req.body;
      const projectId = req.params.id;
      const testRunId = projectId; // Use the same :id as test_run_id
      const userId = req.userid; // Get the logged-in user ID from the middleware
  
      // Validate input data
      if (!title || !status || !priority || !projectId || !testRunId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      // Check if the project exists
      const project = await models.Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
  
      // Check if the test run exists
      const testRun = await models.TestRun.findByPk(testRunId);
      if (!testRun) {
        return res.status(404).json({ success: false, message: "Test Run not found" });
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
        test_run_id: testRunId,
        assigned_to_user_id: userId, // Assign the issue to the logged-in user
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


  controller.deleteIssue = async(req, res) => {
    console.log(req.params.id)
    try {
        const issue = await models.Issue.findByPk(req.params.id)
        if (!issue) {
            return res.status(404).send("Issue not found");
        }
        await issue.destroy();
        req.flash("success", `Delete Issue ${issue.name} successfully!`);
        res.status(204).send();
    } catch (error) {
        return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
  




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
