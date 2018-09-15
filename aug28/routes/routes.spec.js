const request = require('supertest');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

let server;

beforeEach(function()  {
  this.timeout(500);
  server = require('../dist/index/index.js');

});

describe('GET /read-file', () => {
  it('replaces trump with orange asshole', function(done) {
    this.timeout(5000);
    request(server)
      .get('/api/read-file')
      .timeout(5000)
      .expect(200)
      .end((err, response) => {
        const readFile = fs.readFile(path.resolve(__dirname,'write.txt'),
          {encoding: 'utf8', highWaterMark: 16 * 1024}, (err, data) => {
            let hasTrump = data.match(/trump/gim);
            expect(hasTrump).to.eql(null);
            done();
          });
      });
  });
});