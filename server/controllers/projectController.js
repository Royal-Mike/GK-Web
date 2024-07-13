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

        // Lấy danh sách các user không trong current project
        const usersNotInProject = await models.User.findAll({
            where: {
                id: { [Op.notIn]: usersInProject.map(up => up.user_id) }
            }
        });

        // Truyền thông tin project và danh sách user không trong project tới view
        res.render("user/project-detail", { user, project, usersInProject, usersNotInProject });
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

    // Fetch all issues related to the test runs
    const issues = await models.Issue.findAll({
        where: {
        test_run_id: testRunIds,
        },
    });


    // sort issues
  //   const projectId = req.params.id;
  //   const sortType = req.query.sortType || "CreatedAt"; 
  //   const sortOrder = req.query.sortOrder || "Asc"; 
  //   console.log(sortType, sortOrder)
  //   let issues = await models.Issue.findAll({
  //     where: {
  //       project_id: projectId,
  //     },
  //     include: [
  //       {
  //         model: models.Member,
  //         as: "Creator",
  //         include: [
  //           {
  //             model: models.User,
  //             attributes: ["first_name", "last_name"],
  //             required: false,
  //           },
  //         ],
  //         required: false,
  //       },
  //     ],
  //   });
    
  //   issues = issues.sort((a, b) => {
  //     switch (sortType) {
  //       case "Priority":
  //         return sortOrder === "Asc"
  //           ? a.priority.localeCompare(b.priority)
  //           : b.priority.localeCompare(a.priority);
  //       case "Code":
  //         return sortOrder === "Asc" ? a.id - b.id : b.id - a.id;
  //       case "CreatedAt":         
  //         return sortOrder === "Asc"
  //           ? new Date(a.createdAt) - new Date(b.createdAt)
  //           : new Date(b.createdAt) - new Date(a.createdAt);
  //       default:
  //         return 0;
  //       }
  //     })
  //   res.render("issue", {
  //     layout: "main_layout",
  //     issues: issues,
  //   });
  // } catch (error) {
  //   console.error("Error fetching issues:", error);
  //   res.status(500).send("An error occurred while fetching issues.");
  // }
    // Render issues view and pass data
    res.render("developer/issues", { user, project, issues });
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


// Thêm issue
controller.createIssue = async (req, res) => {
  const { name, status, priority, note } = req.body;
  const project_id = parseInt(req.session.project_id);
  const member_id = req.session.projects[project_id].memberId
  console.log(name, project_id, status, priority, note, member_id)
  if (!project_id || !name || !status || !priority || !note) {
    return res.status(400).message({ error: "Missing some fields" });
  }

  try {

    const newIssue = await models.Issue.create({
      name,
      project_id,
      status,
      priority,
      note,
      member_id
    });
    console.log('Test Run created:', newIssue.toJSON());
    res.redirect(`/project/${project_id}/issues`)
  } catch (error) {
    console.error("Error adding issue:", error);
    res.send("Can not add issue!");
    console.error(error);
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




// Thêm issue
// controller.createReport = async (req, res,next) => {
//   const { name, status, priority, note } = req.body;
//   const project_id = parseInt(req.session.project_id);
//   const member_id = req.session.projects[project_id].memberId
//   console.log(name, project_id, status, priority, note, member_id)
//   if (!project_id || !name || !status || !priority || !note) {
//     return res.status(400).message({ error: "Missing some fields" });
//   }

//   try {

//     const newIssue = await models.Issue.create({
//       name,
//       project_id,
//       status,
//       priority,
//       note,
//       member_id
//     });
//     console.log('Test Run created:', newIssue.toJSON());
//     res.redirect(`/project/${project_id}/issues`)
//   } catch (error) {
//     console.error("Error adding issue:", error);
//     res.send("Can not add issue!");
//     console.error(error);
//   }
// };


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
