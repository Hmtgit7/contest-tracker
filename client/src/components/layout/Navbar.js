// client/src/components/layout/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon, FaSignOutAlt, FaUser, FaBookmark } from 'react-icons/fa';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const location = useLocation();

    return (
        <header className="bg-white dark:bg-gray-900 shadow">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
                        >
                            Contest Tracker
                        </motion.div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <NavLink to="/" active={location.pathname === '/'}>
                            Home
                        </NavLink>
                        <NavLink to="/upcoming" active={location.pathname === '/upcoming'}>
                            Upcoming
                        </NavLink>
                        <NavLink to="/ongoing" active={location.pathname === '/ongoing'}>
                            Ongoing
                        </NavLink>
                        <NavLink to="/past" active={location.pathname === '/past'}>
                            Past
                        </NavLink>
                        {isAuthenticated && (
                            <NavLink to="/bookmarks" active={location.pathname === '/bookmarks'}>
                                <FaBookmark className="inline mr-1" /> Bookmarks
                            </NavLink>
                        )}
                        {isAuthenticated && user?.isAdmin && (
                            <NavLink to="/admin" active={location.pathname === '/admin'}>
                                Admin
                            </NavLink>
                        )}
                    </nav>

                    {/* User controls */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-indigo-600" />}
                        </motion.button>

                        {/* Auth buttons */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-2">
                                <Link to="/profile">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center px-3 py-2 text-sm rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                                    >
                                        <FaUser className="mr-1" /> {user?.username}
                                    </motion.button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className="flex items-center px-3 py-2 text-sm rounded-md bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                >
                                    <FaSignOutAlt className="mr-1" /> Logout
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-2 text-sm rounded-md text-indigo-700 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300"
                                    >
                                        Login
                                    </motion.button>
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white dark:bg-indigo-700"
                                    >
                                        Register
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

// Navigation link component
const NavLink = ({ to, children, active }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${active
                    ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
        >
            {children}
        </motion.div>
    </Link>
);

export default Navbar;