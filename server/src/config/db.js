// config/db.js
const mongoose = require('mongoose');
const config = require('./config');

/**
 * Connect to MongoDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;