// client/src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-lg mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-400">404</h1>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                        Page Not Found
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Oops! The page you are looking for doesn't exist or has been moved.
                    </p>

                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            <FaHome className="mr-2" /> Back to Home
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;