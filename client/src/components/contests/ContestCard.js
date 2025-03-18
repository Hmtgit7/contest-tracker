// client/src/components/contests/ContestCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBookmark, FaRegBookmark, FaExternalLinkAlt, FaYoutube } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useContests } from '../../context/ContestContext';
import {
    formatContestDate,
    getTimeRemaining,
    getDuration,
    getPlatformName,
    getStatusColor
} from '../../utils/dateUtils';

const ContestCard = ({ contest }) => {
    const { isAuthenticated } = useAuth();
    const { bookmarkContest, removeBookmark } = useContests();

    const handleBookmarkToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            // Maybe show a login prompt
            return;
        }

        if (contest.isBookmarked) {
            removeBookmark(contest._id);
        } else {
            bookmarkContest(contest._id);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
        >
            <div className="p-5">
                {/* Platform badge */}
                <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {getPlatformName(contest.platform)}
                    </span>

                    {/* Status badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
                        {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                    </span>
                </div>

                {/* Contest title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate mb-2">
                    {contest.name}
                </h3>

                {/* Contest details */}
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                        <span className="font-medium">Starts:</span> {formatContestDate(contest.startTime)}
                    </p>
                    <p>
                        <span className="font-medium">Duration:</span> {getDuration(contest.startTime, contest.endTime)}
                    </p>
                    <p>
                        <span className="font-medium">Time remaining:</span> {getTimeRemaining(contest.startTime)}
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                        {/* Visit contest button */}
                        <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
                        >
                            <FaExternalLinkAlt className="mr-1" /> Visit
                        </a>

                        {/* Solution video button (if available) */}
                        {contest.solutionUrl && (
                            <a
                                href={contest.solutionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                            >
                                <FaYoutube className="mr-1" /> Solution
                            </a>
                        )}
                    </div>

                    {/* Bookmark button */}
                    {isAuthenticated && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleBookmarkToggle}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {contest.isBookmarked ? (
                                <FaBookmark className="text-indigo-600 dark:text-indigo-400" />
                            ) : (
                                <FaRegBookmark className="text-gray-600 dark:text-gray-400" />
                            )}
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ContestCard;