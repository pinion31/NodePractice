'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);

const expect = require('chai').expect;

var _require = require('./dbconfig.js');

let pool = _require.pool;

const sandbox = sinon.createSandbox();
const rewire = require('rewire');

let server = require('../dist/index.js');
let routes = rewire('../dist/routes.js');

let connectionStub;
//let connectionStub = sinon.stub(router.__get__('shouldAbort'),'shouldAbort').rejects({message: 'connection_error'});

//let shouldAbortStub =
afterEach(() => {
  sandbox.restore();

  if (connectionStub) {
    connectionStub.restore();
  }
});

beforeEach(function (done) {
  this.timeout(5000);
  //server = require('../dist/index.js');
  //pool  = require('../dist/dbconfig.js').pool;

  //server = require('../dist/index.js');
  // console.log('running beforeeach');
  pool.query('TRUNCATE users CASCADE');
  // console.log('cascade');
  pool.query('TRUNCATE blog CASCADE', (err, resp) => {
    console.log('inside query');
    pool.query('INSERT INTO users VALUES ($1, $2, $3) RETURNING *', ['Chris', 'test', 'chris@hotmail.com'], (err, result) => {
      if (err) {
        throw new Error('Error setting up tests');
      }
      console.log('before each done');
      pool = require('../dist/dbconfig.js').pool;
      //connectionStub = sinon.stub(pool,'connect').returns({message: 'connection_error'});
      done();
    });
  });
});

//connectionStub = sinon.stub(pool,'connect').resolves({message: 'connection_error'});

describe('/POST add-user', () => {
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

  it('should handle error with connection error', function (done) {
    //connectionStub = sinon.stub(pool,'connect').rejects({message: 'connection_error'});
    //let connectionStub = sinon.stub(pool,"connect").withArgs(true, {},{})
    //console.log('pool', pool.connect());
    //console.log('pool connect', pool.connect)
    let abortStub = () => true;
    let newRoute = routes.__get__('shouldAbort');
    routes.__set__('shouldAbort', abortStub);

    console.log('trit', routes.__get__('shouldAbort'));

    //console.log('routes', routes.__get__('shouldAbort'));
    server = require('../dist/index.js');
    routes = require('../dist/routes.js');
    pool = require('../dist/dbconfig.js').pool; // require again to break cache

    //console.log('server', router.__get__('pool'));
    //console.log('connectionStub', connectionStub);
    this.timeout(5000);
    request(server).post('/add-user').expect(200).timeout(5000).send({ username: 'NicoleTest', password: 'test', email: 'nicole@gmail.com' }).end((err, res) => {
      if (err) throw err;
      //connectionStub = sinon.stub(pool,'connect').rejects({message: 'connection_error'});
      //console.log('server is', server);
      console.log('res body', res.body);
      // const { username, email} = res.body;
      expect(res.status).to.eql(200);
      // expect(username).to.eql('Nicole');
      //connectionStub.restore();
      done();
    });
  });

  /*
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
//# sourceMappingURL=routes.test.js.map