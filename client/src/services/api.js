// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (token expired)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Redirect to login if needed
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;