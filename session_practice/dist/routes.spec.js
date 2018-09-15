'use strict';

const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);

const expect = require('chai').expect;

var _require = require('./dbconfig.js');

const pool = _require.pool;

const sandbox = sinon.sandbox.create();
const rewire = require('rewire');

let server = rewire('../dist/index.js');

afterEach(() => {
  //server = rewire('../dist/index.js');
  sandbox.restore();
});

beforeEach(function (done) {
  this.timeout(5000);
  //server = require('../dist/index.js');
  pool.query('TRUNCATE users CASCADE');
  pool.query('TRUNCATE blog CASCADE', (err, resp) => {
    pool.query('INSERT INTO users VALUES ($1, $2, $3) RETURNING *', ['Chris', 'test', 'chris@hotmail.com'], (err, result) => {
      if (err) {
        throw new Error('Error setting up tests');
      }
      done();
    });
  });
});

describe('/POST add-user', () => {
  let connectionStub;

  it('adds a user', function (done) {
    this.timeout(5000);
    request(server).post('/add-user').expect(200).timeout(5000).send({ username: 'Nicole', password: 'test', email: 'nicole@gmail.com' }).end((err, res) => {
      if (err) throw err;
      var _res$body = res.body;
      const username = _res$body.username,
            email = _res$body.email;

      expect(res.status).to.eql(200);
      expect(username).to.eql('Nicole');
      done();
    });
  });

  it('returns error message if missing information', function (done) {
    this.timeout(5000);
    request(server).post('/add-user').expect(500).timeout(5000).send({ password: 'test', email: 'nicole@gmail.com' }).end((err, res) => {
      if (err) throw err;
      const message = res.body.message;

      expect(res.status).to.eql(500);
      expect(message).to.eql('Missing information');
      done();
    });
  });

  /*
  it('should handle error with connection error', function(done) {
    connectionStub = sandbox.stub(pool, 'connect').rejects(new Error('connection_error'));
    console.log('connectionStub ', typeof connectionStub);
    this.timeout(5000);
    request(server)
      .post('/add-user')
      .expect(200)
      .timeout(5000)
      .send({username: 'Nicole', password: 'test', email: 'nicole@gmail.com'})
      .end((err, res) => {
        if (err) throw err;
        console.log('this was called');
        const { username, email} = res.body;
        expect(res.status).to.eql(200);
        expect(username).to.eql('Nicole');
        done();
    });
  });
    it('rolls back db after error before commit', (done) => {
      done();
  });*/
});

describe('/POST add-blog', () => {
  it('adds a blog', function (done) {
    this.timeout(5000);
    request(server).post('/add-blog').expect(200).timeout(5000).send({ body: 'This is a blog', owner: 'chris@hotmail.com' }).end((err, res) => {
      if (err) throw err;
      var _res$body2 = res.body;
      const body = _res$body2.body,
            owner = _res$body2.owner;

      expect(res.status).to.eql(200);
      expect(body).to.eql('This is a blog');
      expect(owner).to.eql('chris@hotmail.com');
      done();
    });
  });
});
//# sourceMappingURL=routes.spec.js.map