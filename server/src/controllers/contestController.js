// controllers/contestController.js
const Contest = require('../models/Contest');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const contestService = require('../services/contestService');
const { validationResult } = require('express-validator');

/**
 * Get all contests with filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} Filtered contests
 */
exports.getContests = async (req, res) => {
    try {
        const { platforms, status } = req.query;

        // Prepare filters
        const filters = {};

        // Parse platforms filter
        if (platforms) {
            filters.platforms = platforms.split(',');
        }

        // Set status filter
        if (status && ['upcoming', 'ongoing', 'past'].includes(status)) {
            filters.status = status;
        }

        // Get contests
        const contests = await contestService.getContests(filters);

        // If user is authenticated, include bookmark information
        if (req.user) {
            const bookmarks = await Bookmark.find({ user: req.user.id });
            const bookmarkedContestIds = new Set(bookmarks.map(b => b.contest.toString()));

            // Add isBookmarked flag to each contest
            const contestsWithBookmarks = contests.map(contest => {
                const contestObj = contest.toObject();
                contestObj.isBookmarked = bookmarkedContestIds.has(contest._id.toString());
                return contestObj;
            });

            return res.status(200).json({
                success: true,
                count: contestsWithBookmarks.length,
                data: contestsWithBookmarks
            });
        }

        // Return contests without bookmark info for unauthenticated users
        res.status(200).json({
            success: true,
            count: contests.length,
            data: contests
        });
    } catch (error) {
        console.error('Get contests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching contests'
        });
    }
};

/**
 * Get a single contest by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Contest
 */
exports.getContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: 'Contest not found'
            });
        }

        // If user is authenticated, check if contest is bookmarked
        if (req.user) {
            const bookmark = await Bookmark.findOne({
                user: req.user.id,
                contest: contest._id
            });

            const contestObj = contest.toObject();
            contestObj.isBookmarked = !!bookmark;

            return res.status(200).json({
                success: true,
                data: contestObj
            });
        }

        res.status(200).json({
            success: true,
            data: contest
        });
    } catch (error) {
        console.error('Get contest error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching contest'
        });
    }
};

/**
 * Bookmark a contest
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Bookmark
 */
exports.bookmarkContest = async (req, res) => {
    try {
        const { contestId } = req.body;

        // Check if contest exists
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                success: false,
                message: 'Contest not found'
            });
        }

        // Check if already bookmarked
        const existingBookmark = await Bookmark.findOne({
            user: req.user.id,
            contest: contestId
        });

        if (existingBookmark) {
            return res.status(400).json({
                success: false,
                message: 'Contest already bookmarked'
            });
        }

        // Create bookmark
        const bookmark = await Bookmark.create({
            user: req.user.id,
            contest: contestId
        });

        res.status(201).json({
            success: true,
            data: bookmark
        });
    } catch (error) {
        console.error('Bookmark contest error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while bookmarking contest'
        });
    }
};

/**
 * Remove bookmark from a contest
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.removeBookmark = async (req, res) => {
    try {
        const { contestId } = req.params;

        // Find and delete the bookmark
        const bookmark = await Bookmark.findOneAndDelete({
            user: req.user.id,
            contest: contestId
        });

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bookmark removed successfully'
        });
    } catch (error) {
        console.error('Remove bookmark error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing bookmark'
        });
    }
};

/**
 * Get bookmarked contests for current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Array} Bookmarked contests
 */
exports.getBookmarkedContests = async (req, res) => {
    try {
        // Find all bookmarks for the user with populated contest data
        const bookmarks = await Bookmark.find({ user: req.user.id })
            .populate('contest');

        // Extract contest objects and add isBookmarked flag
        const bookmarkedContests = bookmarks.map(bookmark => {
            const contestObj = bookmark.contest.toObject();
            contestObj.isBookmarked = true;
            return contestObj;
        });

        res.status(200).json({
            success: true,
            count: bookmarkedContests.length,
            data: bookmarkedContests
        });
    } catch (error) {
        console.error('Get bookmarked contests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookmarked contests'
        });
    }
};

/**
 * Update contest solution URL manually
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Updated contest
 */
exports.updateContestSolution = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { contestId, solutionUrl } = req.body;

        // Update contest solution
        const updatedContest = await contestService.updateContestSolution(contestId, solutionUrl);

        res.status(200).json({
            success: true,
            data: updatedContest
        });
    } catch (error) {
        console.error('Update contest solution error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating contest solution'
        });
    }
};

/**
 * Force refresh contests data from all platforms
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.refreshContests = async (req, res) => {
    try {
        // Update contests
        await contestService.updateContests();

        res.status(200).json({
            success: true,
            message: 'Contests refreshed successfully'
        });
    } catch (error) {
        console.error('Refresh contests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while refreshing contests'
        });
    }
};

/**
 * Force refresh contest solutions from YouTube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
exports.refreshSolutions = async (req, res) => {
    try {
        // Update contest solutions
        await contestService.updateContestSolutions();

        res.status(200).json({
            success: true,
            message: 'Contest solutions refreshed successfully'
        });
    } catch (error) {
        console.error('Refresh solutions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while refreshing contest solutions'
        });
    }
};