// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        // Allow the request to proceed without authentication for routes that support both
        // public and private access
        if (req.originalUrl.startsWith('/api/contests') && req.method === 'GET') {
            return next();
        }

        return res.status(401).json({
            success: false,
            message: 'No token, authorization denied'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Add user to request
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

