const router = require('express').Router();
const WordCount = require('../models/word_count');
const request = require('request');


// Construct a successful JSON response
function jsonResponseOk(word_count) {
    return {
        status: 'ok',
        word: word_count.word,
        url: word_count.url,
        word_count: word_count.word_count,
    };
}

// Check if URL is valid
function isValidUrl(url) {
    // This pattern is not perfect but it's better than nothing
    const full_url_pattern = /^http(s)?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;
    return url.match(full_url_pattern) && true || false;
}


// GET /
// Form for querying the API
router.get('/', (req, res, next) => {
    res.render('wordcount/index');
});


// GET /wordcount
// The word counter API endpoint
router.get('/wordcount', (req, res, next) => {
    const url = req.query.url || false;
    const word = req.query.word || false;

    if (url && word) {
        // Check if it's a valid URL first
        if (!isValidUrl(url)) {
            const err = new Error('Please supply a valid URL');
            err.status = 400;  // Bad request
            return next(err);
        }

        // Check if it's already in the database
        // If it is, then return it to the view immediately.
        WordCount.findOne({word: word, url: url}).exec((err, word_count) => {
            if (err) return next(err);

            if (word_count !== null) {
                // Render to response if record is found
                res.statusCode = 200;
                const context = {
                    word: word_count.word,
                    url: word_count.url,
                    word_count: word_count.word_count,
                };
                return res.json(jsonResponseOk(context));
            } else {
                // Get page source and parse
                request(url, (error, response, body) => {
                    if (error) return next(error);

                    if (!error && response.statusCode === 200) {
                        const source = body.toString();
                        const regex = new RegExp(`\\b${word}\\b`, 'gi');
                        const matches = source.match(regex);
                        const word_count = matches && matches.length || 0;

                        // Save to database
                        WordCount.create({...req.query, word_count}, (err, word_count) => {
                            if (err) return next(err);
                            res.statusCode = 200;
                            return res.json(jsonResponseOk(word_count));
                        });
                    }
                });
            }
        });
    } else {
        const err = new Error('Both `url` and `word` parameters are required!');
        err.status = 400;  // Bad request
        return next(err);
    }
});


// GET /docs
// Documentation about the API
router.get('/docs', (req, res) => res.render('wordcount/docs'));

module.exports = router;
