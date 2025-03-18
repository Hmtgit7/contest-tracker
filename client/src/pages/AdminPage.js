// client/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaYoutube, FaSync, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useContests } from '../context/ContestContext';
import api from '../services/api';

const AdminPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { fetchContests } = useContests();

    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [formData, setFormData] = useState({
        contestId: '',
        solutionUrl: ''
    });
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Check if user is authenticated and is admin
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!user?.isAdmin) {
            navigate('/');
            return;
        }

        // Fetch past contests for the solution form
        const fetchPastContests = async () => {
            setLoading(true);
            try {
                const res = await api.get('/contests?status=past');
                setContests(res.data.data);
            } catch (err) {
                console.error('Error fetching past contests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPastContests();
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear errors and success on change
        setFormError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.contestId || !formData.solutionUrl) {
            setFormError('All fields are required');
            return;
        }

        try {
            setLoading(true);

            // Update contest solution
            await api.post('/contests/solution', formData);

            // Show success message
            setSuccess('Solution link added successfully');

            // Reset form
            setFormData({
                contestId: '',
                solutionUrl: ''
            });

            // Refresh contests
            fetchContests();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Error adding solution link');
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshContests = async () => {
        try {
            setRefreshing(true);

            // Refresh contests
            await api.post('/contests/refresh');

            // Show success message
            setSuccess('Contests refreshed successfully');

            // Refresh contests list
            fetchContests();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Error refreshing contests');
        } finally {
            setRefreshing(false);
        }
    };

    const handleRefreshSolutions = async () => {
        try {
            setRefreshing(true);

            // Refresh contest solutions
            await api.post('/contests/refresh-solutions');

            // Show success message
            setSuccess('Contest solutions refreshed successfully');

            // Refresh contests list
            fetchContests();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Error refreshing solutions');
        } finally {
            setRefreshing(false);
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
                Admin Dashboard
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Solution Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-6">
                            <FaYoutube className="text-red-600 dark:text-red-400 text-2xl mr-3" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Add Contest Solution
                            </h2>
                        </div>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
                                {formError}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-md">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="contestId" className="block text-gray-700 dark:text-gray-300 mb-2">
                                    Contest
                                </label>
                                <select
                                    id="contestId"
                                    name="contestId"
                                    value={formData.contestId}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    disabled={loading}
                                >
                                    <option value="">Select a contest</option>
                                    {contests.map((contest) => (
                                        <option key={contest._id} value={contest._id}>
                                            {contest.name} ({contest.platform})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="solutionUrl" className="block text-gray-700 dark:text-gray-300 mb-2">
                                    YouTube Solution URL
                                </label>
                                <input
                                    type="url"
                                    id="solutionUrl"
                                    name="solutionUrl"
                                    value={formData.solutionUrl}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    disabled={loading}
                                />
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
                                    <FaPlus className="mr-2" />
                                )}
                                Add Solution Link
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

                {/* Refresh Controls */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-6">
                            <FaSync className="text-indigo-600 dark:text-indigo-400 text-2xl mr-3" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Refresh Data
                            </h2>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Manually refresh contest data from the source platforms or update solution links from YouTube.
                        </p>

                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleRefreshContests}
                                disabled={refreshing}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
                            >
                                {refreshing ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                ) : (
                                    <FaSync className="mr-2" />
                                )}
                                Refresh Contests
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleRefreshSolutions}
                                disabled={refreshing}
                                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center"
                            >
                                {refreshing ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                ) : (
                                    <FaYoutube className="mr-2" />
                                )}
                                Refresh YouTube Solutions
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPage;