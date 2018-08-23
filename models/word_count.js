const mongoose = require('mongoose');
const timestamp = require('./timestamp');


const WordCountSchema = new mongoose.Schema({
    word: {
        type: String,
        max: 100,
        required: true,
        trim: true,
    },
    word_count: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    ...timestamp,
});


// Word and page should be unique together
WordCountSchema.index({ word: 1, url: 1 }, { unique: true });


// Make sure the URL will be saved as a full URL
WordCountSchema.pre('save', function(next) {
    const url = this.url;
    const full_url_pattern = /^http(s)?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;

    const match = url.match(full_url_pattern);

    if (! match) {
        const err = new Error('URL invalid');
        return next(err);
    }

    next();
});


const WordCount = mongoose.model('WordCount', WordCountSchema);

module.exports = WordCount;
