// routes/contests.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const contestController = require('../controllers/contestController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/contests
// @desc    Get all contests with filters
// @access  Public/Private (additional features for authenticated users)
router.get('/', contestController.getContests);

// @route   GET /api/contests/:id
// @desc    Get a single contest by ID
// @access  Public/Private (additional features for authenticated users)
router.get('/:id', contestController.getContest);

// @route   POST /api/contests/bookmark
// @desc    Bookmark a contest
// @access  Private
router.post('/bookmark', auth, [
    check('contestId', 'Contest ID is required').not().isEmpty()
], contestController.bookmarkContest);

// @route   DELETE /api/contests/bookmark/:contestId
// @desc    Remove bookmark from a contest
// @access  Private
router.delete('/bookmark/:contestId', auth, contestController.removeBookmark);

// @route   GET /api/contests/bookmarks/me
// @desc    Get bookmarked contests for current user
// @access  Private
router.get('/bookmarks/me', auth, contestController.getBookmarkedContests);

// @route   POST /api/contests/solution
// @desc    Update contest solution URL manually
// @access  Private (Admin only)
router.post('/solution', [auth, adminAuth], [
    check('contestId', 'Contest ID is required').not().isEmpty(),
    check('solutionUrl', 'Valid solution URL is required').isURL()
], contestController.updateContestSolution);

// @route   POST /api/contests/refresh
// @desc    Force refresh contests data from all platforms
// @access  Private (Admin only)
router.post('/refresh', [auth, adminAuth], contestController.refreshContests);

// @route   POST /api/contests/refresh-solutions
// @desc    Force refresh contest solutions from YouTube
// @access  Private (Admin only)
router.post('/refresh-solutions', [auth, adminAuth], contestController.refreshSolutions);

module.exports = router;