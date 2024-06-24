const controller = {};
const { where } = require("sequelize");
const models = require("../models");
const { Op } = require("sequelize");

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

    const totalPages = Math.ceil(count / pageSize);

    res.render("tester/project-view", {
      user,
      userProjects,
      projects,
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

    const totalPages = Math.ceil(count / pageSize);

    res.json({ projects, currentPage: page, totalPages });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết dự án
controller.projectDetailView = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    // Lấy thông tin project từ cơ sở dữ liệu
    const project = await models.Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Truyền thông tin project tới view
    res.render("user/project-detail", { project });
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

controller.testCaseView = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const page = isNaN(req.query.page)
      ? 1
      : Math.max(1, parseInt(req.query.page)); // Lấy số trang từ query, mặc định là 1
    const pageSize = 5; // Số lượng testcase trên mỗi trang
    const offset = (page - 1) * pageSize;

    // Lấy thông tin project từ cơ sở dữ liệu
    const project = await models.Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const userId = req.userid;

    // Tìm tất cả các testcase có project_id bằng project.id
    const testcases = await models.Testcase.findAndCountAll({
      where: { project_id: project.id },
      limit: pageSize,
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    // Tính toán tổng số trang
    const totalPages = Math.ceil(testcases.count / pageSize);

    // Truyền thông tin project và danh sách testcase tới view
    res.render("tester/test-case", {
      project,
      testcases: testcases.rows,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

// Tạo mới testcase
controller.createTestCase = async (req, res) => {
  try {
    const { name, description } = req.body;
    const projectId = req.params.id;

    const maxTestCaseId = await models.Testcase.max("id");

    // Tạo mới testcase
    const testCase = await models.Testcase.create({
      id: maxTestCaseId + 1,
      project_id: projectId,
      title: name,
      description,
      created_at: new Date(),
    });

    // Trả về testcase mới tạo cho máy khách
    res.status(201).json({ success: true, testCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

controller.testRunView = async (req, res, next) => {
  try {
    const projectId = req.params.id;
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
    const userId = req.userid;

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

// Create new test run
controller.createTestRun = async (req, res) => {
  try {
    const { name, test_case_id, assigned_to_user_id, release_description } =
      req.body;
    const projectId = req.params.id;

    const maxTestRunId = await models.TestRun.max("id");

    // Tạo một bản ghi test run mới trong cơ sở dữ liệu
    const newTestRun = await models.TestRun.create({
      id: maxTestRunId + 1,
      project_id: projectId, // Sử dụng projectId từ req.params.id
      test_case_id,
      status: "Pending", // Trạng thái mặc định hoặc thay đổi tùy theo yêu cầu
      assigned_to_user_id,
      started_at: new Date(), // hoặc để là null nếu chưa bắt đầu
    });

    // Sau khi tạo thành công, lấy lại danh sách test runs mới nhất
    const testRuns = await models.TestRun.findAll({
      where: { project_id: projectId },
      order: [["started_at", "DESC"]], // Sắp xếp theo thời gian tạo mới nhất
      limit: 10, // Giới hạn số lượng test runs lấy về
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
    const projectId = req.params.id;

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
    res.render("developer/issues", { project, issues });
  } catch (error) {
    next(error);
  }
};

controller.issueDetailView = async (req, res, next) => {
  try {
    const projectId = req.params.id;
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
    res.render("developer/issues-detail", { project, issue, projectId });
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
controller.createIssue = async (req, res,next) => {
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
  const projectId = req.params.id;
  try {
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
      res.render('user/reports', {reports, project});
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



module.exports = controller;
