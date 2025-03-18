// client/src/components/auth/AuthForm.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const AuthForm = ({
    type = 'login',
    onSubmit,
    loading,
    error
}) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear error for this field
        if (formErrors[e.target.name]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (type === 'register') {
            if (!formData.username.trim()) {
                errors.username = 'Username is required';
            }

            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (type === 'register' && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Submit the form
            const submitData = {
                email: formData.email,
                password: formData.password
            };

            if (type === 'register') {
                submitData.username = formData.username;
            }

            onSubmit(submitData);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md mx-auto"
        >
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
                {type === 'login' ? 'Login to Your Account' : 'Create a New Account'}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {type === 'register' && (
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`pl-10 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your username"
                            />
                        </div>
                        {formErrors.username && (
                            <p className="mt-1 text-red-500 text-sm">{formErrors.username}</p>
                        )}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`pl-10 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your email"
                        />
                    </div>
                    {formErrors.email && (
                        <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`pl-10 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your password"
                        />
                    </div>
                    {formErrors.password && (
                        <p className="mt-1 text-red-500 text-sm">{formErrors.password}</p>
                    )}
                </div>

                {type === 'register' && (
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`pl-10 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Confirm your password"
                            />
                        </div>
                        {formErrors.confirmPassword && (
                            <p className="mt-1 text-red-500 text-sm">{formErrors.confirmPassword}</p>
                        )}
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center"
                >
                    {loading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    ) : type === 'login' ? (
                        <FaSignInAlt className="mr-2" />
                    ) : (
                        <FaUserPlus className="mr-2" />
                    )}

                    {type === 'login' ? 'Login' : 'Register'}
                </motion.button>
            </form>

            <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
                {type === 'login' ? (
                    <>
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            Login
                        </Link>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default AuthForm;