'use strict';

const express = require('express');
const app = express();
const path = require('path');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('static'));

/**
  set routes for actions
*/


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../static', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App started at ' + new Date(Date.now()));
});