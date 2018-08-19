"use strict";

const expect = require("chai").expect;
const dotenv = require("dotenv");
const request = require("supertest");


dotenv.load("../.env");


describe('Test API', () => {
    let server;

    before(done => {
        // Start express app
        server = require('../index');
        done();
    });

    after(done => {
        // Close express app
        server.close();
        done();
    });

    it('should render homepage just fine', done => {
        request(server)
            .get('/')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200, done);
    });

    it('should return HTTP 400 bad request if no parameters was supplied', done => {
        request(server)
            .get('/wordcount')
            .expect({
                status: 'error',
                message: 'Both `url` and `word` parameters are required!',
            })
            .expect(400, done);
    });

    it('should return HTTP 400 bad request if no URL was supplied', done => {
        request(server)
            .get('/wordcount')
            .query({ word: 'fit' })
            .expect({
                status: 'error',
                message: 'Both `url` and `word` parameters are required!',
            })
            .expect(400, done);
    });

    it('should return HTTP 400 bad request if no word was supplied', done => {
        request(server)
            .get('/wordcount')
            .query({ url: 'http://virtusize.jp' })
            .expect({
                status: 'error',
                message: 'Both `url` and `word` parameters are required!',
            })
            .expect(400, done);
    });

    it('should return HTTP 400 bad request if URL supplied is not a full URL or is invalid', done => {
        request(server)
            .get('/wordcount')
            .query({ url: 'virtusize.jp', word: 'fit' })
            .expect({
                status: 'error',
                message: 'Please supply a valid URL',
            })
            .expect(400, done);
    });

    it('should return the correct word count and should be case-insensitive', done => {
        request(server)
            .get('/wordcount')
            .query({ url: 'http://wordcounterapi.herokuapp.com/docs', word: 'api' })
            .expect({
                "status": "ok",
                "word": "api",
                "url": "http://wordcounterapi.herokuapp.com/docs",
                "word_count": 5,
            })
            .expect(200, done);
    });
});

