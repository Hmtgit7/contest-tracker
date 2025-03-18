// middleware/adminAuth.js
const User = require('../models/User');

/**
 * Middleware to check if user is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
module.exports = async (req, res, next) => {
    try {
        // Check if user exists and is admin
        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Admin privilege required'
            });
        }

        next();
    } catch (error) {
        console.error('Admin authorization error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authorization'
        });
    }
};

