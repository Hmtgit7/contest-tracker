// client/src/utils/authToken.js
import api from '../services/api';

/**
 * Set auth token in axios headers
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete api.defaults.headers.common['x-auth-token'];
    }
};