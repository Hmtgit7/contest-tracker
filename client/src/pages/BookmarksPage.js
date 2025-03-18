// client/src/pages/BookmarksPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookmark } from 'react-icons/fa';
import { useContests } from '../context/ContestContext';
import { useAuth } from '../context/AuthContext';
import ContestList from '../components/contests/ContestList';
import PlatformFilter from '../components/filters/PlatformFilter';
import StatusFilter from '../components/filters/StatusFilter';

const BookmarksPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const {
        fetchBookmarkedContests,
        bookmarkedContests,
        loading,
        error
    } = useContests();

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Fetch bookmarked contests
        fetchBookmarkedContests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center mb-8"
            >
                <FaBookmark className="text-indigo-600 dark:text-indigo-400 text-3xl mr-3" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Bookmarked Contests
                </h1>
            </motion.div>

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
                        {error ? (
                            <div className="text-center p-8">
                                <p className="text-red-500 dark:text-red-400">{error}</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        Your Bookmarked Contests
                                    </h2>

                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {bookmarkedContests.length} bookmarks
                                    </div>
                                </div>

                                {bookmarkedContests.length > 0 ? (
                                    <ContestList contests={bookmarkedContests} loading={loading} />
                                ) : (
                                    <div className="text-center py-10">
                                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                            You haven't bookmarked any contests yet
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-500 mt-2">
                                            Browse contests and click the bookmark icon to save them for later
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookmarksPage;