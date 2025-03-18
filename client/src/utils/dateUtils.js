// client/src/utils/dateUtils.js
import { formatDistanceToNow, format, formatDistance } from 'date-fns';

/**
 * Format contest date and time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatContestDate = (date) => {
    const contestDate = new Date(date);
    return format(contestDate, 'MMM dd, yyyy HH:mm');
};

/**
 * Calculate time remaining until contest start
 * @param {Date|string} startTime - Contest start time
 * @returns {string} Time remaining string
 */
export const getTimeRemaining = (startTime) => {
    const contestStartTime = new Date(startTime);
    const now = new Date();

    if (contestStartTime <= now) {
        return 'Started';
    }

    return formatDistanceToNow(contestStartTime, { addSuffix: true });
};

/**
 * Calculate duration between start and end times
 * @param {Date|string} startTime - Contest start time
 * @param {Date|string} endTime - Contest end time
 * @returns {string} Duration string
 */
export const getDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    return formatDistance(start, end);
};

/**
 * Get platform logo/icon
 * @param {string} platform - Contest platform
 * @returns {string} CSS class for the platform icon
 */
export const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
        case 'codeforces':
            return 'codeforces-icon';
        case 'codechef':
            return 'codechef-icon';
        case 'leetcode':
            return 'leetcode-icon';
        default:
            return 'default-icon';
    }
};

/**
 * Get platform display name
 * @param {string} platform - Contest platform
 * @returns {string} Display name
 */
export const getPlatformName = (platform) => {
    switch (platform.toLowerCase()) {
        case 'codeforces':
            return 'Codeforces';
        case 'codechef':
            return 'CodeChef';
        case 'leetcode':
            return 'LeetCode';
        default:
            return platform;
    }
};

/**
 * Get color for contest status
 * @param {string} status - Contest status
 * @returns {string} CSS class for status
 */
export const getStatusColor = (status) => {
    switch (status) {
        case 'upcoming':
            return 'text-blue-600 dark:text-blue-400';
        case 'ongoing':
            return 'text-green-600 dark:text-green-400';
        case 'past':
            return 'text-gray-600 dark:text-gray-400';
        default:
            return 'text-gray-600 dark:text-gray-400';
    }
};