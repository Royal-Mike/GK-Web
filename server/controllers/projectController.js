// const controller = {}
// const { where } = require('sequelize');
// const models = require('../models');
// //xử lý cho trang chủ
// controller.projectView = async (req, res, next) => {
//     try {
//         // Any additional logic or data fetching can be done here
//         res.render('tester/project-view');
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = controller;
const controller = {}
const { where } = require('sequelize');
const models = require('../models');



controller.projectView = async (req, res, next) => {
  try {
    const userId = req.userid; // Lấy user ID từ token đã xác thực
    const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page)); // Lấy số trang từ query, mặc định là 1
    const pageSize = 8; // Số lượng dự án trên mỗi trang
    const offset = (page - 1) * pageSize;

    // Lấy thông tin user từ cơ sở dữ liệu
    const user = await models.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy tất cả các User_Project của user
    const userProjects = await models.User_Project.findAll({ where: { user_id: userId } });

    // Lấy tất cả các project của user với phân trang
    const projectIds = userProjects.map(up => up.project_id);
    const { count, rows: projects } = await models.Project.findAndCountAll({
      where: { id: projectIds },
      limit: pageSize,
      offset: offset
    });

    // Tính toán tổng số trang
    const totalPages = Math.ceil(count / pageSize);

    // Truyền thông tin user, userProjects và projects tới view
    res.render('tester/project-view', { user, userProjects, projects, currentPage: page, totalPages });
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
    res.render('user/project-detail', { project });
  } catch (error) {
    next(error);
  }
};

// create new project
controller.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userid;

    const maxProjectId = await models.Project.max('id');

    // Tạo mới dự án
    const project = await models.Project.create({ id: maxProjectId + 1, name_project: name, description,  created_at: new Date() });

    // Thêm liên kết vào bảng User_Project
    await models.User_Project.create({ user_id: userId, project_id: project.id, role_id: 1 });

    // Trả về dự án mới tạo cho máy khách
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


controller.testCaseView = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page)); // Lấy số trang từ query, mặc định là 1
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
      offset: offset
    });

    // Tính toán tổng số trang
    const totalPages = Math.ceil(testcases.count / pageSize);

    // Truyền thông tin project và danh sách testcase tới view
    res.render('tester/test-case', { project, testcases: testcases.rows, currentPage: page, totalPages });
  } catch (error) {
    next(error);
  }
};

// Tạo mới testcase
controller.createTestCase = async (req, res) => {
  try {
    const { name, description } = req.body;
    const projectId = req.params.projectId; // Lấy projectId từ URL

    const maxTestCaseId = await models.TestCase.max('id');

    // Tạo mới testcase
    const testCase = await models.TestCase.create({ id: maxTestCaseId + 1, project_id: projectId, title: name, description, created_at: new Date() });

    // Trả về testcase mới tạo cho máy khách
    res.status(201).json({ success: true, testCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = controller;
