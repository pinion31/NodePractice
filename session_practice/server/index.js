'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routes);

app.listen(8000, () => {
  console.log('listening on port 8000 at  ' + new Date(Date.now()));
});

module.exports = app;
