const controller = {};
const { where } = require('sequelize');
const models = require('../models');
const { Op } = require('sequelize');




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

        const userProjects = await models.User_Project.findAll({ where: { user_id: userId } });
        const projectIds = userProjects.map(up => up.project_id);

        let whereCondition = { id: projectIds };
        if (searchTerm) {
            whereCondition.name_project = { [Op.iLike]: `%${searchTerm}%` };
        }

        let orderCondition = [['created_at', 'DESC']];
        if (sortBy && ['name_project', 'created_at'].includes(sortBy)) {
            orderCondition = [[sortBy, sortOrder === 'asc' ? 'ASC' : 'DESC']];
        }

        const count = await models.Project.count({ where: whereCondition });

        const projects = await models.Project.findAll({
            where: whereCondition,
            order: orderCondition,
            limit: pageSize,
            offset: offset
        });

        const totalPages = Math.ceil(count / pageSize);

        res.render('tester/project-view', { user, userProjects, projects, currentPage: page, totalPages });

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

        const userProjects = await models.User_Project.findAll({ where: { user_id: userId } });
        const projectIds = userProjects.map(up => up.project_id);

        let whereCondition = { id: projectIds };
        if (searchTerm) {
            whereCondition.name_project = { [Op.iLike]: `%${searchTerm}%` };
        }

        let orderCondition = [['created_at', 'DESC']];
        if (sortBy && ['name_project', 'created_at'].includes(sortBy)) {
            orderCondition = [[sortBy, sortOrder === 'asc' ? 'ASC' : 'DESC']];
        }

        const count = await models.Project.count({ where: whereCondition });

        const projects = await models.Project.findAll({
            where: whereCondition,
            order: orderCondition,
            limit: pageSize,
            offset: offset
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
        res.render('user/project-detail', { project });
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
            return res.status(400).json({ success: false, message: 'Project name is required.' });
        }

        // Check if name contains special symbols
        if (specialSymbolsRegex.test(name)) {
            return res.status(401).json({ success: false, message: 'Project name cannot contain special symbols.' });
        }

        const maxProjectId = await models.Project.max('id');

        // Create the project
        const project = await models.Project.create({
            id: maxProjectId + 1,
            name_project: name,
            description,
            created_at: new Date()
        });

        // Create association in User_Project table
        await models.User_Project.create({ user_id: userId, project_id: project.id, role_id: 1 });

        // Return the newly created project to the client
        res.status(201).json({ success: true, project });
    } catch (error) {
        console.error(error);
        // Handle specific validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ success: false, message: error.errors[0].message });
        }
        res.status(500).json({ success: false, message: 'An error occurred while creating the project. Please try again.' });
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
            offset: offset,
            order: [['created_at', 'DESC']]
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
        const projectId = req.params.id;

        const maxTestCaseId = await models.Testcase.max('id');

        // Tạo mới testcase
        const testCase = await models.Testcase.create({ id: maxTestCaseId + 1, project_id: projectId, title: name, description, created_at: new Date() });

        // Trả về testcase mới tạo cho máy khách
        res.status(201).json({ success: true, testCase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

controller.testRunView = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
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
            offset: offset
        });

        // Tìm tất cả các testcase có project_id bằng project.id
        const testcases = await models.Testcase.findAll({
            where: { project_id: project.id }
        });

        // Fetch users with role_id = 3 associated with the project from the User_Project table
        const usersWithRole = await models.User_Project.findAll({
            where: {
                project_id: projectId,
                role_id: 3
            },
            include: [
                {
                    model: models.User,
                    attributes: ['id', 'username'] // Select only necessary attributes
                }
            ]
        });

        // Extract the user data from the result
        const users = usersWithRole.map(up => up.User);

        // Calculate total pages
        const totalPages = Math.ceil(testRuns.count / pageSize);

        // Pass project and test run information to the view
        res.render('tester/test-run', { project, testRuns: testRuns.rows, currentPage: page, totalPages, users, testcases });
    } catch (error) {
        next(error);
    }
};

// Create new test run
controller.createTestRun = async (req, res) => {
    try {
        const { name, test_case_id, assigned_to_user_id, release_description } = req.body;
        const projectId = req.params.id;

        const maxTestRunId = await models.TestRun.max('id');

        // Tạo một bản ghi test run mới trong cơ sở dữ liệu
        const newTestRun = await models.TestRun.create({
            id: maxTestRunId + 1,
            project_id: projectId, // Sử dụng projectId từ req.params.id
            test_case_id,
            status: 'Pending', // Trạng thái mặc định hoặc thay đổi tùy theo yêu cầu
            assigned_to_user_id,
            started_at: new Date(), // hoặc để là null nếu chưa bắt đầu
        });

        // Sau khi tạo thành công, lấy lại danh sách test runs mới nhất
        const testRuns = await models.TestRun.findAll({
            where: { project_id: projectId },
            order: [['started_at', 'DESC']], // Sắp xếp theo thời gian tạo mới nhất
            limit: 10 // Giới hạn số lượng test runs lấy về
        });

        // Return the newly created test run to the client
        res.status(201).json({ success: true, newTestRun, testRuns });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create test run' });
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
            attributes: ['id']
        });

        // Extract test run IDs
        const testRunIds = testRuns.map(testRun => testRun.id);

        // Fetch all issues related to the test runs
        const issues = await models.Issue.findAll({
            where: {
                test_run_id: testRunIds
            }
        });

        // Render issues view and pass data
        res.render('developer/issues', { projectId, issues });
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
                id: issueId
            },
            include: [
                {
                    model: models.TestRun,
                    where: { project_id: projectId },
                    attributes: ['id', 'project_id']
                },
                {
                    model: models.User,
                    as: 'User', // Alias phải trùng với tên đã định nghĩa trong mối quan hệ
                    attributes: ['id', 'username']
                }
            ]
        });

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        // Render issue detail view and pass data
        res.render('developer/issues-detail', { project, issue });
    } catch (error) {
        next(error);
    }
};


controller.reportView = async (req, res, next) => {
    try {

        // Pass project and test run information to the view
        res.render('user/reports');
    } catch (error) {
        next(error);
    }
};

module.exports = controller;