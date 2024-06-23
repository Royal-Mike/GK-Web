const controller = {};
const { where } = require('sequelize');
const models = require('../models');

controller.getAccountControl = async (req, res, next) => {
    try {
        // Fetch user data using Sequelize
        const userId = req.userid; // Lấy user ID từ token đã xác thực
        const user = await models.User.findByPk(userId); // Example Sequelize method to fetch user by primary key

        if (!user) {
            // Handle case where user is not found (optional)
            return res.status(404).send('User not found');
        }

        // Render the profile view and pass user data
        res.render('user/profile', { user });
    } catch (error) {
        next(error); // Pass any errors to the error handler middleware
    }
};

// Define the controller function for profile update
controller.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, headline, language, link } = req.body;
        const userId = req.userid; // Assuming you have userId stored in req.userid

        // Find the user by userId
        const user = await models.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Update user profile fields
        user.firstname = firstName;
        user.lastname = lastName;
        user.headline = headline;
        user.language = language;
        user.website_link = link;

        // Save the updated user profile to the database
        await user.save();

        // Respond with success message and updated user object
        res.status(200).json({ success: true, message: 'Profile updated successfully.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while updating profile.' });
    }
};

module.exports = controller;