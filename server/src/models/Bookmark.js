// models/Bookmark.js
const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a unique compound index on user and contest
BookmarkSchema.index({ user: 1, contest: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);

module.exports = Bookmark;