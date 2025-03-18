// client/src/components/filters/PlatformFilter.js
import React from 'react';
import { motion } from 'framer-motion';
import { useContests } from '../../context/ContestContext';
import { getPlatformName } from '../../utils/dateUtils';

const PlatformFilter = () => {
    const { activeFilters, updateFilters } = useContests();

    const platforms = [
        { id: 'codeforces', name: 'Codeforces' },
        { id: 'codechef', name: 'CodeChef' },
        { id: 'leetcode', name: 'LeetCode' }
    ];

    const handlePlatformChange = (platformId) => {
        const currentPlatforms = [...activeFilters.platforms];

        // If platform is already selected, remove it
        if (currentPlatforms.includes(platformId)) {
            // Don't allow removing all platforms
            if (currentPlatforms.length === 1) return;

            updateFilters({
                platforms: currentPlatforms.filter(p => p !== platformId)
            });
        } else {
            // Add the platform
            updateFilters({
                platforms: [...currentPlatforms, platformId]
            });
        }
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Platforms
            </h3>

            <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                    <motion.button
                        key={platform.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlatformChange(platform.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilters.platforms.includes(platform.id)
                                ? 'bg-indigo-600 text-white dark:bg-indigo-700'
                                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                    >
                        {getPlatformName(platform.id)}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default PlatformFilter;