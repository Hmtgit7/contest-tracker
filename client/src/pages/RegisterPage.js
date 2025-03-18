// client/src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const RegisterPage = () => {
    const { register, isAuthenticated, loading, error } = useAuth();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        // If already authenticated, redirect to home
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleRegister = async (formData) => {
        try {
            await register(formData);
            // Redirect will happen automatically due to the useEffect
        } catch (err) {
            setFormError(err.response?.data?.message || 'An error occurred during registration');
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
            >
                <AuthForm
                    type="register"
                    onSubmit={handleRegister}
                    loading={loading}
                    error={formError || error}
                />
            </motion.div>
        </div>
    );
};

export default RegisterPage;