// models/Contest.js
const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['codeforces', 'codechef', 'leetcode']
    },
    url: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,  // Duration in minutes
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'past'],
        required: true
    },
    solutionUrl: {
        type: String,
        default: null
    },
    externalId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a unique compound index on platform and externalId
ContestSchema.index({ platform: 1, externalId: 1 }, { unique: true });

const Contest = mongoose.model('Contest', ContestSchema);

module.exports = Contest;