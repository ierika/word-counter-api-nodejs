'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');
const chalk = require('chalk');
const dotenv = require('dotenv');
const logger = require('morgan');
const mongoose = require('mongoose');


// Logger
app.use(logger('dev'));


// Load dotenv
dotenv.load('./env');


// Constants
const config = {
    DEBUG: (() => {
        const debug = process.env.DEBUG.toLowerCase();
        if (debug === 'true') return true;
    })(),
    PORT: process.env.PORT,
    BASE_DIR: __dirname,
};


// Database
mongoose.connect(process.env.MONGODB_URI, () => console.info('Connected to DB'));
const db = mongoose.connection;
db.on('error', (err) => {
    console.log(
        '%s MongoDB connection error. Please make sure MongoDB is running.',
        err.message,
        chalk.red('✗')
    );
    process.exit();
});


// Settings
app.set('view engine', 'pug');


// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Static files
app.use('/static', express.static('./static'));


// Bootstrap variables to template
app.use((req, res, next) => {
    res.locals.config = config;
    res.locals.req = req;
    next();
});


// Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Routes
app.use(router);


// Return a 404 error if a route wasn't matched.
app.use((err, req, res, next) => {
    const error = new Error(`Page not found.`);
    error.status = 404;
    next(err);
});


// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.json({
        status: 'error',
        message: err.message,
    });
});


// Server
const server = app.listen(config.PORT, err => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
    console.log(`This app is running at port: ${ config.PORT }`);
});

module.exports = server;
