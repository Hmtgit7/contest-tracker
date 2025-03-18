// client/src/pages/ContestStatusPage.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContests } from '../context/ContestContext';
import ContestList from '../components/contests/ContestList';
import PlatformFilter from '../components/filters/PlatformFilter';

const ContestStatusPage = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    const { fetchContests, filteredContests, loading, updateFilters } = useContests();

    // Validate status parameter
    useEffect(() => {
        const validStatuses = ['upcoming', 'ongoing', 'past'];
        if (!validStatuses.includes(status)) {
            navigate('/');
            return;
        }

        // Update filters based on status
        updateFilters({ status });

        // Fetch contests with the specified status
        fetchContests({ status });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    // Get title based on status
    const getTitle = () => {
        switch (status) {
            case 'upcoming':
                return 'Upcoming Contests';
            case 'ongoing':
                return 'Ongoing Contests';
            case 'past':
                return 'Past Contests';
            default:
                return 'Contests';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center"
            >
                {getTitle()}
            </motion.h1>

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
                                {getTitle()}
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

export default ContestStatusPage;