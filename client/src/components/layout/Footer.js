// client/src/components/layout/Footer.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                        <p>
                            &copy; {new Date().getFullYear()} Contest Tracker. All rights reserved.
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        <motion.a
                            href="https://github.com/Hmtgit7"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <FaGithub size={24} />
                        </motion.a>
                        <motion.a
                            href="https://linkedin.com/in/hemant-gehlod"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <FaLinkedin size={24} />
                        </motion.a>
                    </div>
                </div>

                <div className="text-center mt-4 text-gray-500 dark:text-gray-500 text-sm">
                    <p className="flex items-center justify-center">
                        Made with <FaHeart className="mx-1 text-red-500" /> using React, Node.js, and MongoDB
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;