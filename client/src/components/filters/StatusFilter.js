// client/src/components/filters/StatusFilter.js
import React from 'react';
import { motion } from 'framer-motion';
import { useContests } from '../../context/ContestContext';

const StatusFilter = () => {
    const { activeFilters, updateFilters } = useContests();

    const statuses = [
        { id: 'upcoming', name: 'Upcoming' },
        { id: 'ongoing', name: 'Ongoing' },
        { id: 'past', name: 'Past' }
    ];

    const handleStatusChange = (statusId) => {
        updateFilters({
            status: statusId
        });
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Status
            </h3>

            <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                    <motion.button
                        key={status.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatusChange(status.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilters.status === status.id
                                ? 'bg-indigo-600 text-white dark:bg-indigo-700'
                                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                    >
                        {status.name}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default StatusFilter;