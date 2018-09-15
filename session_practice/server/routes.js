'use strict';

const express = require('express');
const router = express.Router();
const { pool } = require('./dbconfig.js');

const redis = require("redis");
const client = redis.createClient();
let shouldAbort = (err, client, done, next) => {
          if (err) {
            console.error('Error in transaction', err.stack);
            client.query('ROLLBACK', err => {
              if (err) {
                console.error('Error rolling back client', err.stack);
              }
              // release the client back to the pool
              done();
              return next(new Error(err));
            });
          }
          return !!err;
};

router.post('/add-user', (req,res,next) => {
  const { username, password, email } = req.body;

  if (username && password && email) {
    //console.log('starting', pool.connect);
    try {
      pool.connect((err, client, done) => {
        if (err)  {
         return res.status(500).json({message:'Cannot connect to server'});
        }
        console.log('connecting');
        client.query('BEGIN', (err) => {
          if ((shouldAbort(err, client, done, next))) { return next(new Error(err)); }
          client.query('INSERT INTO users VALUES ($1, $2, $3) RETURNING username, email',
            [username, password, email],
            (err, response) => {
            if (shouldAbort(err, client, done, next)) { return next(new Error(err)); }
            client.query('COMMIT', (err) => {
                if (err) {
                  return next(new Error(err));
                }
                console.log('committing');
                res.status(200).json(response.rows[0]);
                //res.end("done1");
                done();
            });
          });
        });
      });
    } catch(e) {
      res.end("ERRORS");
      console.log('ERROR');
    }
  } else {
    return res.status(500).json({message:'Missing information'});
    done();
  }
});


router.post('/add-blog', (req,res,next) => {
  const { body, owner } = req.body;
   // need to include (body,owner) or it will try to insert over serial id pk
  pool.query('INSERT INTO blog(body, owner) VALUES ($1, $2) RETURNING body, owner',
    [body, owner],
    (err,response) => {
      if (err) { return next(new Error(err)); }
      client.set(owner, ''); //reset blog cache
      res.status(200).json(response.rows[0]);
    });
});

router.post('/get-blog', (req,res,next) => {
  const { email } = req.body;

  client.get(email, (err, reply) => { //check redis first
    if (reply) {
      return res.status(200).json({blogs: JSON.parse(reply)});
    } else {
      pool.query('SELECT * FROM blog WHERE owner = $1',
        [email],
        (err, response) => {
          if (err) { return next(new Error(err))}
          if (response.rowCount === 0) {
            return res.send('User does not have any blogs');
          }
            client.set(email, JSON.stringify(response.rows));
            res.status(200).json({blogs: response.rows});
        });
    }
  });
});

router.use((err,req,res,next) => {
  if (err) {
    res.send(err.message);
  }
});

module.exports = router;