
// client/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { setAuthToken } from '../utils/authToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user on initial render if token exists
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                setAuthToken(token);
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error('Error loading user:', err);
                    localStorage.removeItem('token');
                    setToken(null);
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    // Register user
    const register = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post('/auth/register', formData);

            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);

            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration');
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post('/auth/login', formData);

            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);

            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
    };

    // Update user preferences
    const updatePreferences = async (preferences) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.put('/auth/preferences', { preferences });
            setUser({ ...user, preferences: res.data.data.preferences });

            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating preferences');
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                error,
                register,
                login,
                logout,
                updatePreferences
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);