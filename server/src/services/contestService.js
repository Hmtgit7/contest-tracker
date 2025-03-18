// services/contestService.js
const axios = require('axios');
const Contest = require('../models/Contest');
const { google } = require('googleapis');
const youtube = google.youtube('v3');
const config = require('../config/config');

/**
 * Service for fetching, processing, and storing contest data
 */
class ContestService {
    /**
     * Fetch contests from Codeforces API
     * @returns {Promise<Array>} Array of codeforces contests
     */
    async fetchCodeforcesContests() {
        try {
            const response = await axios.get('https://codeforces.com/api/contest.list');

            if (response.data.status !== 'OK') {
                throw new Error('Codeforces API error');
            }

            const contests = response.data.result.map(contest => {
                // Convert relative time to absolute time
                const startTimeMs = (contest.startTimeSeconds * 1000);
                const durationMs = (contest.durationSeconds * 1000);
                const endTimeMs = startTimeMs + durationMs;

                // Determine contest status
                const now = Date.now();
                let status = 'upcoming';
                if (startTimeMs <= now && endTimeMs > now) {
                    status = 'ongoing';
                } else if (endTimeMs <= now) {
                    status = 'past';
                }

                return {
                    name: contest.name,
                    platform: 'codeforces',
                    url: `https://codeforces.com/contest/${contest.id}`,
                    startTime: new Date(startTimeMs),
                    endTime: new Date(endTimeMs),
                    duration: Math.floor(contest.durationSeconds / 60), // Convert to minutes
                    status,
                    externalId: contest.id.toString()
                };
            });

            return contests;
        } catch (error) {
            console.error('Error fetching Codeforces contests:', error.message);
            return [];
        }
    }

    /**
     * Fetch contests from CodeChef API
     * @returns {Promise<Array>} Array of codechef contests
     */
    async fetchCodeChefContests() {
        try {
            // CodeChef doesn't have an official API, so we'll use web scraping or an unofficial API
            // For this implementation, we're using a mock/example response
            const response = await axios.get('https://www.codechef.com/api/contests');

            // Process future contests
            const futureContests = response.data.future_contests.map(contest => {
                return {
                    name: contest.contest_name,
                    platform: 'codechef',
                    url: `https://www.codechef.com/${contest.contest_code}`,
                    startTime: new Date(contest.contest_start_date_iso),
                    endTime: new Date(contest.contest_end_date_iso),
                    duration: Math.floor((new Date(contest.contest_end_date_iso) - new Date(contest.contest_start_date_iso)) / (1000 * 60)),
                    status: 'upcoming',
                    externalId: contest.contest_code
                };
            });

            // Process present/ongoing contests
            const presentContests = response.data.present_contests.map(contest => {
                return {
                    name: contest.contest_name,
                    platform: 'codechef',
                    url: `https://www.codechef.com/${contest.contest_code}`,
                    startTime: new Date(contest.contest_start_date_iso),
                    endTime: new Date(contest.contest_end_date_iso),
                    duration: Math.floor((new Date(contest.contest_end_date_iso) - new Date(contest.contest_start_date_iso)) / (1000 * 60)),
                    status: 'ongoing',
                    externalId: contest.contest_code
                };
            });

            // Process past contests
            const pastContests = response.data.past_contests.map(contest => {
                return {
                    name: contest.contest_name,
                    platform: 'codechef',
                    url: `https://www.codechef.com/${contest.contest_code}`,
                    startTime: new Date(contest.contest_start_date_iso),
                    endTime: new Date(contest.contest_end_date_iso),
                    duration: Math.floor((new Date(contest.contest_end_date_iso) - new Date(contest.contest_start_date_iso)) / (1000 * 60)),
                    status: 'past',
                    externalId: contest.contest_code
                };
            });

            return [...futureContests, ...presentContests, ...pastContests];
        } catch (error) {
            console.error('Error fetching CodeChef contests:', error.message);
            return [];
        }
    }

    /**
     * Fetch contests from LeetCode API
     * @returns {Promise<Array>} Array of leetcode contests
     */
    async fetchLeetCodeContests() {
        try {
            // Using LeetCode's GraphQL API
            const response = await axios.post('https://leetcode.com/graphql', {
                query: `
          query getContestList {
            allContests {
              title
              titleSlug
              startTime
              duration
              id
            }
            currentContests: allContests(status: STARTED) {
              title
              titleSlug
              startTime
              duration
              id
            }
          }
        `
            });

            const allContests = response.data.data.allContests;
            const currentContests = response.data.data.currentContests;

            // Identify current contest IDs
            const currentContestIds = new Set(currentContests.map(c => c.id));

            const contests = allContests.map(contest => {
                const startTimeMs = contest.startTime * 1000;
                const durationMs = contest.duration * 1000;
                const endTimeMs = startTimeMs + durationMs;

                // Determine contest status
                let status;
                if (currentContestIds.has(contest.id)) {
                    status = 'ongoing';
                } else if (Date.now() > endTimeMs) {
                    status = 'past';
                } else {
                    status = 'upcoming';
                }

                return {
                    name: contest.title,
                    platform: 'leetcode',
                    url: `https://leetcode.com/contest/${contest.titleSlug}`,
                    startTime: new Date(startTimeMs),
                    endTime: new Date(endTimeMs),
                    duration: Math.floor(contest.duration / 60), // Convert to minutes
                    status,
                    externalId: contest.id.toString()
                };
            });

            return contests;
        } catch (error) {
            console.error('Error fetching LeetCode contests:', error.message);
            return [];
        }
    }

    /**
     * Update the database with the latest contests
     * @returns {Promise<void>}
     */
    async updateContests() {
        try {
            // Fetch contests from all platforms
            const [codeforcesContests, codechefContests, leetcodeContests] = await Promise.all([
                this.fetchCodeforcesContests(),
                this.fetchCodeChefContests(),
                this.fetchLeetCodeContests()
            ]);

            const allContests = [...codeforcesContests, ...codechefContests, ...leetcodeContests];

            // Update or insert contests to database
            for (const contest of allContests) {
                await Contest.findOneAndUpdate(
                    { platform: contest.platform, externalId: contest.externalId },
                    contest,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }

            console.log(`Successfully updated contests: ${allContests.length} contests processed`);
        } catch (error) {
            console.error('Error updating contests:', error.message);
            throw error;
        }
    }

    /**
     * Fetch YouTube solution videos and update contests
     * @param {Object} options - Options for fetching YouTube videos
     * @returns {Promise<void>}
     */
    async updateContestSolutions(options = {}) {
        try {
            // Define playlists for each platform
            const playlists = {
                leetcode: config.youtube.leetcodePlaylistId,
                codeforces: config.youtube.codeforcesPlaylistId,
                codechef: config.youtube.codechefPlaylistId
            };

            // Process each platform
            for (const [platform, playlistId] of Object.entries(playlists)) {
                if (!playlistId) continue;

                // Get playlist items
                const playlistItems = await this.getPlaylistItems(playlistId);

                // Process each video
                for (const item of playlistItems) {
                    // Extract contest ID from the video title or description
                    const contestId = this.extractContestId(item.snippet.title, item.snippet.description, platform);

                    if (contestId) {
                        // Update the contest with the solution URL
                        await Contest.findOneAndUpdate(
                            { platform, externalId: contestId },
                            {
                                solutionUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                                updatedAt: new Date()
                            }
                        );
                    }
                }
            }

            console.log('Successfully updated contest solutions');
        } catch (error) {
            console.error('Error updating contest solutions:', error.message);
            throw error;
        }
    }

    /**
     * Get items from a YouTube playlist
     * @param {string} playlistId - YouTube playlist ID
     * @returns {Promise<Array>} Array of playlist items
     */
    async getPlaylistItems(playlistId) {
        try {
            const response = await youtube.playlistItems.list({
                key: config.youtube.apiKey,
                part: 'snippet',
                maxResults: 50,
                playlistId
            });

            return response.data.items || [];
        } catch (error) {
            console.error('Error fetching YouTube playlist items:', error.message);
            return [];
        }
    }

    /**
     * Extract contest ID from video title or description
     * @param {string} title - Video title
     * @param {string} description - Video description
     * @param {string} platform - Contest platform
     * @returns {string|null} Contest ID or null if not found
     */
    extractContestId(title, description, platform) {
        // Implement platform-specific logic to extract contest ID
        switch (platform) {
            case 'codeforces':
                // Example pattern: "Codeforces Round #123" or "CF123"
                const cfMatch = title.match(/Codeforces Round #(\d+)|CF(\d+)/i);
                return cfMatch ? (cfMatch[1] || cfMatch[2]) : null;

            case 'codechef':
                // Example pattern: "CodeChef LTIME123" or "COOK123"
                const ccMatch = title.match(/(LTIME|COOK)(\d+)/i);
                return ccMatch ? `${ccMatch[1]}${ccMatch[2]}` : null;

            case 'leetcode':
                // Example pattern: "LeetCode Weekly Contest 123" or "Biweekly Contest 45"
                const lcMatch = title.match(/Weekly Contest (\d+)|Biweekly Contest (\d+)/i);
                if (lcMatch) {
                    const num = lcMatch[1] || lcMatch[2];
                    const isWeekly = title.includes('Weekly');
                    return isWeekly ? `weekly-${num}` : `biweekly-${num}`;
                }
                return null;

            default:
                return null;
        }
    }

    /**
     * Get contests filtered by platform and status
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} Array of filtered contests
     */
    async getContests(filters = {}) {
        try {
            const query = {};

            // Apply platform filter
            if (filters.platforms && filters.platforms.length > 0) {
                query.platform = { $in: filters.platforms };
            }

            // Apply status filter
            if (filters.status) {
                query.status = filters.status;
            }

            // Get contests from the database
            return await Contest.find(query).sort({ startTime: filters.status === 'past' ? -1 : 1 });
        } catch (error) {
            console.error('Error getting contests:', error.message);
            throw error;
        }
    }

    /**
     * Manually update a contest with solution URL
     * @param {string} contestId - Contest ID
     * @param {string} solutionUrl - Solution URL
     * @returns {Promise<Object>} Updated contest
     */
    async updateContestSolution(contestId, solutionUrl) {
        try {
            const contest = await Contest.findByIdAndUpdate(
                contestId,
                {
                    solutionUrl,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!contest) {
                throw new Error('Contest not found');
            }

            return contest;
        } catch (error) {
            console.error('Error updating contest solution:', error.message);
            throw error;
        }
    }
}

module.exports = new ContestService();