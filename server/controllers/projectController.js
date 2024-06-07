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

    // Lấy thông tin user từ cơ sở dữ liệu
    const user = await models.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy tất cả các User_Project của user
    const userProjects = await models.User_Project.findAll({ where: { user_id: userId } });

    // Lấy tất cả các project của user
    const projectIds = userProjects.map(up => up.project_id);
    const projects = await models.Project.findAll({ where: { id: projectIds } });

    // Truyền thông tin user, userProjects và projects tới view
    res.render('tester/project-view', { user, userProjects, projects });
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
