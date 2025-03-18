// client/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, updatePreferences, loading } = useAuth();

    const [preferences, setPreferences] = useState({
        platforms: {
            codeforces: true,
            codechef: true,
            leetcode: true
        },
        darkMode: false
    });

    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Set initial preferences from user
        if (user?.preferences) {
            setPreferences(user.preferences);
        }
    }, [isAuthenticated, user, navigate]);

    const handlePlatformChange = (platform) => {
        setPreferences({
            ...preferences,
            platforms: {
                ...preferences.platforms,
                [platform]: !preferences.platforms[platform]
            }
        });

        // Clear success message on change
        setSuccess('');
    };

    const handleThemeChange = () => {
        setPreferences({
            ...preferences,
            darkMode: !preferences.darkMode
        });

        // Clear success message on change
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updatePreferences(preferences);

            // Show success message
            setSuccess('Preferences updated successfully');
        } catch (err) {
            console.error('Error updating preferences:', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center mb-8"
            >
                <FaUser className="text-indigo-600 dark:text-indigo-400 text-3xl mr-3" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Your Profile
                </h1>
            </motion.div>

            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        User Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {user?.username}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        Preferences
                    </h2>

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-md">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                                Default Platforms
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Select which platforms you want to see by default
                            </p>

                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="codeforces"
                                        checked={preferences.platforms.codeforces}
                                        onChange={() => handlePlatformChange('codeforces')}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="codeforces" className="ml-2 block text-gray-700 dark:text-gray-300">
                                        Codeforces
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="codechef"
                                        checked={preferences.platforms.codechef}
                                        onChange={() => handlePlatformChange('codechef')}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="codechef" className="ml-2 block text-gray-700 dark:text-gray-300">
                                        CodeChef
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="leetcode"
                                        checked={preferences.platforms.leetcode}
                                        onChange={() => handlePlatformChange('leetcode')}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="leetcode" className="ml-2 block text-gray-700 dark:text-gray-300">
                                        LeetCode
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                                Theme
                            </h3>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="darkMode"
                                    checked={preferences.darkMode}
                                    onChange={handleThemeChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="darkMode" className="ml-2 block text-gray-700 dark:text-gray-300">
                                    Dark Mode
                                </label>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            ) : (
                                <FaSave className="mr-2" />
                            )}
                            Save Preferences
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;