const request = require('supertest');
const express = require('express');
const app = express();
require('../routes/appRoutes')(app);

describe('Ping server', () => {
    it('should return a success json', function(done) {
      request(app)
        .get("/api/ping")
        .expect('Content-Type', /json/)
        .expect({ "success": true })
        .expect(200, done)
    })
});
describe('Get blog posts with no tags', () => {
  it('should return status 400 with error', function(done) {
    request(app)
      .get("/api/posts/")
      .expect('Content-Type', /json/)
      .expect({ "error": "Tags parameter is required" })
      .expect(400, done)
  })
});
describe('Get blog posts with invalid sort param', () => {
  it('should return status 400 with error', function(done) {
    request(app)
      .get("/api/posts/?tags=tech&sortBy=book")
      .expect('Content-Type', /json/)
      .expect({ "error": "sortBy parameter is invalid" })
      .expect(400, done)
  })
});
describe('Get blog posts', () => {
    it('should return an object containing blogposts', function(done) {
      request(app)
        .get("/api/posts/?tags=tech")
        .expect('Content-Type', /json/)
        // .expect(res => {
        //   (res.body)
        // })
        .expect(200, done)
    })
});
