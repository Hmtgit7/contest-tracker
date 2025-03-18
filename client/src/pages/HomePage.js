// client/src/pages/HomePage.js
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaHistory, FaBookmark } from 'react-icons/fa';
import { useContests } from '../context/ContestContext';
import { useAuth } from '../context/AuthContext';
import ContestList from '../components/contests/ContestList';
import PlatformFilter from '../components/filters/PlatformFilter';
import StatusFilter from '../components/filters/StatusFilter';

const HomePage = () => {
    const { fetchContests, filteredContests, loading, activeFilters, updateFilters } = useContests();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Set default filter to upcoming contests
        updateFilters({ status: 'upcoming' });

        // Fetch contests with default filters
        fetchContests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
                >
                    Programming Contest Tracker
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                    Stay updated with all programming contests from Codeforces, CodeChef, and LeetCode
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar with filters */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                            Filters
                        </h2>

                        <PlatformFilter />
                        <StatusFilter />

                        {/* Quick links */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                                Quick Links
                            </h3>

                            <div className="space-y-2">
                                <Link to="/upcoming">
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                    >
                                        <FaCalendarAlt className="mr-2" /> Upcoming Contests
                                    </motion.div>
                                </Link>
                                <Link to="/ongoing">
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                    >
                                        <FaClock className="mr-2" /> Ongoing Contests
                                    </motion.div>
                                </Link>
                                <Link to="/past">
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                    >
                                        <FaHistory className="mr-2" /> Past Contests
                                    </motion.div>
                                </Link>
                                {isAuthenticated && (
                                    <Link to="/bookmarks">
                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                            <FaBookmark className="mr-2" /> Bookmarked Contests
                                        </motion.div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="lg:col-span-3"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {activeFilters.status.charAt(0).toUpperCase() + activeFilters.status.slice(1)} Contests
                            </h2>

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {filteredContests.length} contests
                            </div>
                        </div>

                        <ContestList contests={filteredContests} loading={loading} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;