// server.js
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/config');
const contestService = require('./services/contestService');

// Connect to database
connectDB();

// Start server
const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);

    // Initial contest fetch
    console.log('Fetching initial contest data...');
    contestService.updateContests()
        .then(() => console.log('Initial contest data fetched successfully'))
        .catch(error => console.error('Error fetching initial contest data:', error));

    // Schedule regular contest updates
    setInterval(async () => {
        try {
            await contestService.updateContests();
            console.log('Contests updated successfully');
        } catch (error) {
            console.error('Error updating contests:', error);
        }
    }, config.contestRefreshInterval);

    // Schedule YouTube solution updates (once a day)
    if (config.youtube.apiKey) {
        setInterval(async () => {
            try {
                await contestService.updateContestSolutions();
                console.log('Contest solutions updated successfully');
            } catch (error) {
                console.error('Error updating contest solutions:', error);
            }
        }, 24 * 60 * 60 * 1000); // 24 hours
    }
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});