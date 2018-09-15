'use strict';

const express = require('express');
const RedisStore = require('connect-redis')(express);
const session = require('express-session');

const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    db: 2,
    pass: 'funky password',
    ttl: (1 * 60)
  }),
  name: 'id',
  secret: 'This is a nice secret',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  if(!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;

  res.send('hello' + req.session.views + 'times so far');
});

app.listen(3000);
