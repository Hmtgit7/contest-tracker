// config/config.js
require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/contest-tracker',
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY,
        leetcodePlaylistId: process.env.LEETCODE_PLAYLIST_ID,
        codeforcesPlaylistId: process.env.CODEFORCES_PLAYLIST_ID,
        codechefPlaylistId: process.env.CODECHEF_PLAYLIST_ID
    },
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    contestRefreshInterval: parseInt(process.env.CONTEST_REFRESH_INTERVAL || 3600000) // Default: 1 hour
};