// client/src/components/layout/Alert.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const Alert = ({ message, type = 'info', onClose }) => {
    const variants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    // Define alert styling based on type
    const getAlertStyle = () => {
        switch (type) {
            case 'success':
                return {
                    bgColor: 'bg-green-100 dark:bg-green-900',
                    textColor: 'text-green-800 dark:text-green-200',
                    borderColor: 'border-green-500',
                    icon: <FaCheckCircle className="text-green-500" />
                };
            case 'error':
                return {
                    bgColor: 'bg-red-100 dark:bg-red-900',
                    textColor: 'text-red-800 dark:text-red-200',
                    borderColor: 'border-red-500',
                    icon: <FaExclamationCircle className="text-red-500" />
                };
            case 'info':
            default:
                return {
                    bgColor: 'bg-blue-100 dark:bg-blue-900',
                    textColor: 'text-blue-800 dark:text-blue-200',
                    borderColor: 'border-blue-500',
                    icon: <FaInfoCircle className="text-blue-500" />
                };
        }
    };

    const { bgColor, textColor, borderColor, icon } = getAlertStyle();

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md rounded-md shadow-lg border-l-4 ${borderColor} ${bgColor} p-4`}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                            {icon}
                        </div>
                        <div className="ml-3 w-full">
                            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    onClick={onClose}
                                    className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Alert;